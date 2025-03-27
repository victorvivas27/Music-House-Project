package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.UserService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.*;
import lombok.AllArgsConstructor;
import org.modelmapper.MappingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final ObjectMapper objectMapper;

    // 🔹 OBTENER TODOS LOS USUARIOS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserDtoExit>>> getAllUsers() {
        try {
            List<UserDtoExit> userDtoExits = userService.getAllUser();
            return ResponseEntity.ok(ApiResponse.<List<UserDtoExit>>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Lista de usuarios obtenida con éxito.")
                    .error(null)
                    .result(userDtoExits)
                    .build());

        } catch (MappingException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<UserDtoExit>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Error interno al obtener usuarios.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 OBTENER USUARIO POR ID
    @GetMapping("/search/{idUser}")
    public ResponseEntity<ApiResponse<UserDtoExit>> getUserById(@PathVariable UUID idUser) {
        try {

            UserDtoExit foundUser = userService.getUserById(idUser);
            return ResponseEntity.ok(ApiResponse.<UserDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Usuario encontrado con éxito.")
                    .error(null)
                    .result(foundUser)
                    .build());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UserDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró el usuario con el ID proporcionado.")
                            .error(e.getMessage())
                            .result(null)
                            .build());

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<UserDtoExit>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .error(null)
                            .result(null)
                            .build());
        }
    }

    // 🔹 ACTUALIZAR USUARIO
    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<?>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            // 📌 Convertir el JSON String a un objeto UserDtoModify
            UserDtoModify userDtoModify = objectMapper.readValue(userJson, UserDtoModify.class);

            // 📌 Validación manual
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<UserDtoModify>> violations = validator.validate(userDtoModify);

            if (!violations.isEmpty()) {
                String errorMessage = violations.stream()
                        .map(ConstraintViolation::getMessage)
                        .findFirst()
                        .orElse("Datos inválidos");

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<Void>builder()
                                .status(HttpStatus.BAD_REQUEST)
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .message("Error en la validación de los datos enviados.")
                                .error(errorMessage)
                                .result(null)
                                .build());
            }

            // 📌 Llamar al servicio para actualizar
            UserDtoExit userDtoExit = userService.updateUser(userDtoModify, file);

            return ResponseEntity.ok(ApiResponse.<UserDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Usuario actualizado con éxito.")
                    .result(userDtoExit)
                    .error(null)
                    .build());

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("El correo ingresado ya está en uso. Por favor, elija otro.")
                            .result(null)
                            .error(e.getMessage())
                            .build());

        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró el usuario con el ID proporcionado.")
                            .error(e.getMessage())
                            .result(null)
                            .build());

        } catch (JsonProcessingException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("Error al procesar el JSON de entrada.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 ELIMINAR USUARIO
    @DeleteMapping("/delete/{idUser}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable UUID idUser) throws ResourceNotFoundException {

            if (idUser == null) {
                throw new IllegalArgumentException("El ID del usuario no puede ser nulo.");
            }

            userService.deleteUser(idUser);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Usuario con ID " + idUser + " eliminado exitosamente.")
                    .error(null)
                    .result(null)
                    .build());


    }
}