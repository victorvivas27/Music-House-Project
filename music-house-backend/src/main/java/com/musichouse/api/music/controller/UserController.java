package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.UserService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.modelmapper.MappingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final ObjectMapper objectMapper;


    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserDtoExit>>> allPhone() {
        try {
            List<UserDtoExit> userDtoExits = userService.getAllUser();
            ApiResponse<List<UserDtoExit>> response =
                    new ApiResponse<>("Lista de Usuarios exitosa.", userDtoExits);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (MappingException e) {
            LOGGER.error("Error al obtener la lista de usuarios: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/search/{idUser}")
    public ResponseEntity<ApiResponse<UserDtoExit>> searchUserById(@PathVariable UUID idUser) {
        try {
            UserDtoExit foundUser = userService.getUserById(idUser);
            return ResponseEntity.ok(new ApiResponse<>("Usuario encontrado.", foundUser));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró el usuario con el ID proporcionado.", null));
        }
    }

    @PutMapping(value= "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,  // Se recibe el JSON como String
            @RequestPart("file") MultipartFile file // Se recibe el archivo como MultipartFile
    )
    {
        try {
            // Convertir el JSON String a un objeto UserDtoEntrance
            UserDtoModify userDtoModify = objectMapper.readValue(userJson,UserDtoModify.class);

            UserDtoExit userDtoExit = userService.updateUser(userDtoModify,file);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Usuario actualizado con éxito.", userDtoExit));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("El correo electrónico ingresado ya está en uso. Por favor, elija otro correo electrónico.", null));

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró el usuario con el ID proporcionado.", null));
        } catch (JsonMappingException e) {
            throw new RuntimeException(e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


    @DeleteMapping("/delete/{idUser}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID idUser) {
        try {
            userService.deleteUser(idUser);
            return ResponseEntity.ok(new ApiResponse<>("Usuario con ID " + idUser + " eliminado exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("El Usuario con el ID " + idUser + " no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}