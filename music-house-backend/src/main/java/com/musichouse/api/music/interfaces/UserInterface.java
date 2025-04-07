package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import jakarta.mail.MessagingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface UserInterface {

    TokenDtoExit createUser(UserDtoEntrance userDtoEntrance, MultipartFile file) throws MessagingException;

    Page<UserDtoExit> getAllUser(Pageable pageable);

    UserDtoExit getUserById(UUID idUser) throws ResourceNotFoundException;

    UserDtoExit updateUser(UserDtoModify userDtoModify, MultipartFile file) throws ResourceNotFoundException;

    void deleteUser(UUID idUser) throws ResourceNotFoundException;

    TokenDtoExit loginUserAndCheckEmail(LoginDtoEntrance loginDtoEntrance) throws ResourceNotFoundException;
}
