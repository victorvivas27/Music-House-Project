package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserAdminDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.Role;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.interfaces.UserInterface;
import com.musichouse.api.music.repository.*;
import com.musichouse.api.music.security.JwtService;
import com.musichouse.api.music.telegramchat.TelegramService;
import com.musichouse.api.music.util.RoleConstants;
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
    private final RolRepository rolRepository;
    private final AddressRepository addressRepository;
    private final PhoneRepository phoneRepository;
    private final ModelMapper modelMapper;
    private final TelegramService telegramService;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;
    @Autowired
    private final MailManager mailManager;


    @Transactional
    @Override
    public TokenDtoExit createUser(UserDtoEntrance userDtoEntrance, MultipartFile file)
            throws DataIntegrityViolationException, MessagingException {

        // 1️⃣ **Verificar si el usuario ya existe antes de subir la imagen o enviar mensaje**
        if (userRepository.existsByEmail(userDtoEntrance.getEmail())) {
            throw new DataIntegrityViolationException("El correo electrónico ingresado ya está en uso.");
        }

        // 2️⃣ **Si el usuario no existe, continuar con el registro**
        User user = modelMapper.map(userDtoEntrance, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3️⃣ **Obtener o crear el rol de usuario**
        Role role = rolRepository.findByRol(RoleConstants.USER)
                .orElseGet(() -> rolRepository.save(new Role(RoleConstants.USER)));

        user.setRoles(Set.of(role));
        user.setTelegramChatId(userDtoEntrance.getTelegramChatId());
        
        user.getAddresses().forEach(address -> address.setUser(user));

        user.getPhones().forEach(phone -> phone.setUser(user));

        // 4️⃣ **Subir la imagen a AWS S3 solo después de verificar el usuario**
        String fileUrl = awss3Service.uploadFileToS3(file);
        user.setPicture(fileUrl);

        // 5️⃣ **Guardar usuario en la base de datos**
        User userSaved = userRepository.save(user);

        // 6️⃣ **Generar token**
        String token = jwtService.generateToken(userSaved);

        // 7️⃣ **Enviar mensaje de bienvenida por correo**
        try {
            sendMessageUser(userSaved.getEmail(), userSaved.getName(), userSaved.getLastName());
        } catch (MessagingException e) {
            LOGGER.warn("No se pudo enviar el correo de bienvenida a {}", userSaved.getEmail(), e);
        }

        // 8️⃣ **Enviar mensaje de bienvenida en Telegram**
        telegramService.enviarMensajeDeBienvenida(
                userSaved.getTelegramChatId(),
                userSaved.getName(),
                userSaved.getLastName(),
                userSaved.getEmail()

        );

        // 9️⃣ **Construcción con Builder**
        return TokenDtoExit.builder()
                .idUser(userSaved.getIdUser())
                .name(userSaved.getName())
                .lastName(userSaved.getLastName())
                .roles(new ArrayList<>(userSaved.getRoles()))
                .token(token)
                .build();
    }


    @Transactional
    @Override
    public TokenDtoExit createUserAdmin(UserAdminDtoEntrance userAdminDtoEntrance)
            throws DataIntegrityViolationException, MessagingException {

        // Verificar si el usuario ya existe por su email
        if (userRepository.existsByEmail(userAdminDtoEntrance.getEmail())) {
            throw new DataIntegrityViolationException("El correo electrónico ingresado ya está en uso.");
        }

        User user = modelMapper.map(userAdminDtoEntrance, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Obtener o crear el rol de ADMIN
        Role role = rolRepository.findByRol(RoleConstants.ADMIN)
                .orElseGet(() -> rolRepository.save(new Role(RoleConstants.ADMIN)));

        user.setRoles(Set.of(role));

        // Generar token antes de guardar el usuario
        String token = jwtService.generateToken(user);

        User userSaved = userRepository.save(user);

        // Enviar correo de bienvenida
        boolean emailSent = true;
        try {
            sendMessageUser(userSaved.getEmail(), userSaved.getName(), userSaved.getLastName());
        } catch (MessagingException e) {
            emailSent = false;
            LOGGER.warn("No se pudo enviar el correo de bienvenida a {}", userSaved.getEmail(), e);
        }


        // Construcción con Builder
        return TokenDtoExit.builder()
                .idUser(userSaved.getIdUser())
                .name(userSaved.getName())
                .lastName(userSaved.getLastName())
                .roles(new ArrayList<>(userSaved.getRoles()))
                .token(token)
                .build();
    }

    @Override
    public TokenDtoExit loginUserAndCheckEmail(LoginDtoEntrance loginDtoEntrance) throws ResourceNotFoundException, AuthenticationException {
        Optional<User> userOptional = userRepository.findByEmail(loginDtoEntrance.getEmail());
        if (userOptional.isEmpty()) {
            throw new ResourceNotFoundException("Usuario no encontrado con el correo electrónico proporcionado.");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDtoEntrance.getEmail(), loginDtoEntrance.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        User user = userOptional.get();
        TokenDtoExit tokenDtoSalida = new TokenDtoExit(
                user.getIdUser(),
                user.getName(),
                user.getLastName(),
                new ArrayList<>(user.getRoles()),
                token
        );
        return tokenDtoSalida;
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
            throw new ResourceNotFoundException("User not found with id: " + idUser);
        }

        return userDtoExit;
    }

    @Override
    public UserDtoExit updateUser(UserDtoModify userDtoModify) throws ResourceNotFoundException {
        User userToUpdate = userRepository.findById(userDtoModify.getIdUser())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDtoModify.getIdUser()));
        userToUpdate.setName(userDtoModify.getName());
        userToUpdate.setLastName(userDtoModify.getLastName());
        userToUpdate.setEmail(userDtoModify.getEmail());
        String newPassword = userDtoModify.getPassword();
        if (newPassword != null && !newPassword.isEmpty()) {
            String contraseñaEncriptada = passwordEncoder.encode(newPassword);
            userToUpdate.setPassword(contraseñaEncriptada);
        }
        userRepository.save(userToUpdate);
        return modelMapper.map(userToUpdate, UserDtoExit.class);

    }


    @Override
    public void deleteUser(UUID idUser) throws ResourceNotFoundException {
        Optional<User> usuarioOptional = userRepository.findById(idUser);
        if (usuarioOptional.isPresent()) {
            User usuario = usuarioOptional.get();
            favoriteRepository.deleteByUserId(idUser);
            usuario.getRoles().clear();
            userRepository.save(usuario);
            userRepository.deleteById(idUser);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + idUser);
        }
    }


    public void sendMessageUser(String email, String name, String lastName) throws MessagingException {
        mailManager.sendMessage(email, name, lastName);

    }


}
