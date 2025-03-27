package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.Roles;
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
import com.musichouse.api.music.telegramchat.TelegramService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class UserService implements UserInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    //private final RolRepository rolRepository;
    private final AddressRepository addressRepository;
    private final PhoneRepository phoneRepository;
    private final ModelMapper modelMapper;
    private final TelegramService telegramService;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;
    @Autowired
    private final MailManager mailManager;


    @Override
    @Transactional
    public TokenDtoExit createUser(UserDtoEntrance userDtoEntrance, MultipartFile file)
            throws DataIntegrityViolationException, MessagingException {

        if (userRepository.existsByEmail(userDtoEntrance.getEmail())) {
            throw new DataIntegrityViolationException("El correo electrónico: " + userDtoEntrance.getEmail());
        }

        User user = modelMapper.map(userDtoEntrance, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UUID generatedId = UUID.randomUUID(); // 🔑 Generás el ID
        user.setIdUser(generatedId);

        Set<Roles> roles = userDtoEntrance.getRoles() != null && !userDtoEntrance.getRoles().isEmpty()
                ? new HashSet<>(userDtoEntrance.getRoles())
                : Set.of(Roles.USER);
        user.setRoles(roles);

        user.setTelegramChatId(userDtoEntrance.getTelegramChatId());
        user.getAddresses().forEach(address -> address.setUser(user));
        user.getPhones().forEach(phone -> phone.setUser(user));

        // 🔄 Subís imagen usando el ID generado
        String fileUrl = awss3Service.uploadFileToS3User(file, generatedId);
        user.setPicture(fileUrl);

        // 🗂️ Guardás el usuario
        User userSaved = userRepository.save(user);

        String token = jwtService.generateToken(userSaved);

        try {
            sendMessageUser(userSaved.getEmail(), userSaved.getName(), userSaved.getLastName());
        } catch (MessagingException e) {
            String errorMessage = String.format("No se pudo enviar el correo de bienvenida a %s", userSaved.getEmail());
            throw new MessagingException(errorMessage, e);
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
    public TokenDtoExit loginUserAndCheckEmail(LoginDtoEntrance loginDtoEntrance) throws ResourceNotFoundException, AuthenticationException {
        Optional<User> userOptional = userRepository.findByEmail(loginDtoEntrance.getEmail());
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado con el correo electrónico: " + loginDtoEntrance.getEmail());
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDtoEntrance.getEmail(), loginDtoEntrance.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        User user = userOptional.get();

        return TokenDtoExit.builder()
                .idUser(user.getIdUser())
                //.name(user.getName())
                //.lastName(user.getLastName())
                //.roles(user.getRoles().stream().map(Roles::name).toList())
                .token(token)
                .build();
    }

    public List<UserDtoExit> getAllUser() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDtoExit.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDtoExit getUserById(UUID idUser) throws ResourceNotFoundException {
        User user = userRepository.findById(idUser).orElse(null);
        UserDtoExit userDtoExit = null;
        if (user != null) {
            userDtoExit = modelMapper.map(user, UserDtoExit.class);
        } else {
            throw new ResourceNotFoundException("Usuario id: " + idUser);
        }

        return userDtoExit;
    }

    @Override
    public UserDtoExit updateUser(UserDtoModify userDtoModify, MultipartFile file) throws ResourceNotFoundException {
        // 🟢 1️⃣ Buscar el usuario a actualizar
        User userToUpdate = userRepository.findById(userDtoModify.getIdUser())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDtoModify.getIdUser()));

        // 🟢 2️⃣ Verificar si el email ya está en uso
        if (!userToUpdate.getEmail().equals(userDtoModify.getEmail()) &&
                userRepository.existsByEmail(userDtoModify.getEmail())) {
            throw new DataIntegrityViolationException("El correo electrónico ingresado ya está en uso.");
        }

        // 🟢 3️⃣ Actualizar datos del usuario
        userToUpdate.setName(userDtoModify.getName());
        userToUpdate.setLastName(userDtoModify.getLastName());
        userToUpdate.setEmail(userDtoModify.getEmail());

        // 🟢 3️⃣ Opcional: actualizar roles si vienen en la request
        if (userDtoModify.getRoles() != null && !userDtoModify.getRoles().isEmpty()) {
            Set<Roles> newRoles = new HashSet<>(userDtoModify.getRoles());
            userToUpdate.setRoles(newRoles);
        }

        // 🟢 4️⃣ Manejo de la imagen en S3
        if (file != null && !file.isEmpty()) {
            // 📌 Obtener la URL de la imagen actual
            String currentImageUrl = userToUpdate.getPicture();

            // 📌 Eliminar imagen anterior solo si existe
            if (currentImageUrl != null && !currentImageUrl.isEmpty()) {
                String key = S3UrlParser.extractKeyFromS3Url(currentImageUrl);
                awss3Service.deleteFileFromS3(key);
            }

            // 📌 5️⃣ Subir la nueva imagen con la carpeta del usuario
            String newFileUrl = awss3Service.uploadUserModifyFileToS3(file, userDtoModify);
            userToUpdate.setPicture(newFileUrl);
        }

        // 🟢 6️⃣ Guardar cambios en la base de datos
        userRepository.save(userToUpdate);

        return modelMapper.map(userToUpdate, UserDtoExit.class);
    }


    @Override
    public void deleteUser(UUID idUser) throws ResourceNotFoundException {
        Optional<User> usuarioOptional = userRepository.findById(idUser);

        if (usuarioOptional.isPresent()) {
            User usuario = usuarioOptional.get();

            // 🟢 Obtener la URL de la imagen guardada en S3
            String imageUrl = usuario.getPicture();

            // 🟢 Si la imagen existe, intentar eliminarla (sin interrumpir el flujo si falla)
            if (imageUrl != null && !imageUrl.isEmpty()) {

                String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                awss3Service.deleteFileFromS3(key);

            }

            // 🟢 Eliminar relaciones del usuario
            favoriteRepository.deleteByUserId(idUser);
            usuario.getRoles().clear();
            userRepository.save(usuario);

            // 🟢 Eliminar usuario
            userRepository.deleteById(idUser);

        } else {
            throw new ResourceNotFoundException("User not found with id: " + idUser);
        }
    }


    public void sendMessageUser(String email, String name, String lastName) throws MessagingException {
        mailManager.sendMessage(email, name, lastName);

    }


}
