package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.interfaces.UserInterface;
import com.musichouse.api.music.repository.AddressRepository;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.PhoneRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.service.StringValidator;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import com.musichouse.api.music.telegramchat.TelegramService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;


@Service
@AllArgsConstructor
public class UserService implements UserInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AddressRepository addressRepository;
    private final PhoneRepository phoneRepository;
    private final ModelMapper modelMapper;
    private final TelegramService telegramService;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;
    private final S3FileDeleter s3FileDeleter;
    private final UserValidator userValidator;
    private final UserBuilder userBuilder;
    private final EmailService emailService;
    private final AuthHelper authHelper;

    @Autowired
    private final MailManager mailManager;


    @Override
    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public TokenDtoExit createUser(UserDtoEntrance userDtoEntrance, MultipartFile file)
            throws DataIntegrityViolationException, MessagingException {


        userValidator.validateUniqueEmail(userDtoEntrance);


        UUID id = UUID.randomUUID();
        String imageUrl;

        if (file != null && !file.isEmpty()) {
            imageUrl = awss3Service.uploadFileToS3User(file, id);
        } else {
            imageUrl = awss3Service.copyDefaultUserImage(id);
        }
        User user = userBuilder.buildUserWithImage(userDtoEntrance, id, imageUrl);


        User userSaved = userRepository.save(user);
        String token = jwtService.generateToken(userSaved);


        try {
            emailService.sendWelcomeEmail(userSaved);
        } catch (MessagingException e) {
            throw new MessagingException(
                    "No se pudo enviar el correo de bienvenida a " + userSaved.getEmail(), e);
        }

        telegramService.enviarMensajeDeBienvenida(
                userSaved.getTelegramChatId(),
                userSaved.getName(),
                userSaved.getLastName(),
                userSaved.getEmail()
        );


        return TokenDtoExit.builder()
                .idUser(userSaved.getIdUser())
                .token(token)
                .build();
    }


    @Override
    public TokenDtoExit loginUserAndCheckEmail(LoginDtoEntrance loginDtoEntrance)
            throws ResourceNotFoundException, AuthenticationException {

        User user = userValidator.validateUserExistsByEmail(loginDtoEntrance.getEmail());

        Authentication authentication = authHelper.authenticate(loginDtoEntrance.getEmail(), loginDtoEntrance.getPassword());

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);


        return TokenDtoExit.builder()
                .idUser(user.getIdUser())
                .token(token)
                .build();
    }

    @Cacheable(value = "users")
    public Page<UserDtoExit> getAllUser(Pageable pageable) {

        Page<User> usersPage = userRepository.findAll(pageable);

        return usersPage.map(user -> modelMapper.map(user, UserDtoExit.class));
    }


    @Override
    @Cacheable(value = "users", key = "#idUser")
    public UserDtoExit getUserById(UUID idUser) throws ResourceNotFoundException {

        User user = userValidator.validateUserId(idUser);

        return modelMapper.map(user, UserDtoExit.class);
    }


    @Override
    @CacheEvict(value = "users", allEntries = true)
    public UserDtoExit updateUser(UserDtoModify userDtoModify, MultipartFile file)
            throws ResourceNotFoundException {

        User userToUpdate = userValidator.validateUserId(userDtoModify.getIdUser());

        userValidator.validateEmailNotTakenOnUpdate(userToUpdate, userDtoModify.getEmail());

        modelMapper.map(userDtoModify, userToUpdate);

        // Reemplazar roles explícitamente
        if (userDtoModify.getRoles() != null) {
            userToUpdate.getRoles().clear();
            userToUpdate.getRoles().addAll(userDtoModify.getRoles());
        }

        userValidator.validateUserHasAtLeastOneRole(userToUpdate);

        userBuilder.updateUserImageIfPresent(userToUpdate, file);

        userRepository.save(userToUpdate);

        return modelMapper.map(userToUpdate, UserDtoExit.class);
    }


    @Override
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(UUID idUser) throws ResourceNotFoundException {

        User user = userValidator.validateUserId(idUser);

        String imageUrl = user.getPicture();


        favoriteRepository.deleteByUserId(idUser);


        user.getRoles().clear();

        userRepository.save(user);


        userRepository.delete(user);

        if (imageUrl != null && !imageUrl.isEmpty()) {

            String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
            s3FileDeleter.deleteFileFromS3(key);

        }

    }


    @Cacheable(
            value = "users",
            key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()"
    )
    public Page<UserDtoExit> searchUserName(String name, Pageable pageable)
            throws IllegalArgumentException {

        StringValidator.validateBasicText(name, name);

        Page<User> users = userRepository.findByNameContainingIgnoreCase(name.trim(), pageable);

        return users.map(user -> modelMapper.map(user, UserDtoExit.class));

    }

}
