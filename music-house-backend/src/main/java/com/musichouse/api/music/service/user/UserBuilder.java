package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.entity.Roles;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Component
@AllArgsConstructor
public class UserBuilder {
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final ImageCleaner imageCleaner;
    private final AWSS3Service awss3Service;


    public User buildUserWithImage(UserDtoEntrance userDtoEntrance, UUID id, String imageUrl) {

        User user = modelMapper.map(userDtoEntrance, User.class);

        user.setPassword(passwordEncoder.encode(user.getPassword()));


        user.setIdUser(id);

        user.setPicture(imageUrl);

        Set<Roles> roles = userDtoEntrance.getRoles() != null && !userDtoEntrance.getRoles().isEmpty()
                ? new HashSet<>(userDtoEntrance.getRoles())
                : Set.of(Roles.USER);

        user.setRoles(roles);

        user.setTelegramChatId(userDtoEntrance.getTelegramChatId());

        user.getAddresses().forEach(address -> address.setUser(user));

        user.getPhones().forEach(phone -> phone.setUser(user));


        return user;
    }

    public User updateUserImageIfPresent(User userToUpdate, MultipartFile file) {
        if (file != null && !file.isEmpty()) {

            imageCleaner.deleteImageFromS3(userToUpdate.getPicture());


            String picture = awss3Service.uploadSingleFile(file, "usuarios/" + userToUpdate.getIdUser());


            userToUpdate.setPicture(picture);
        }

        return userToUpdate;
    }


}
