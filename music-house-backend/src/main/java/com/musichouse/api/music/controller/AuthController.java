package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserAdminDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.UserService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.*;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final static Logger LOGGER = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

   /* @PostMapping(value = "/create/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<TokenDtoExit>> createUserAdmin(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        UserAdminDtoEntrance userAdminDtoEntrance = null; // Inicialización para evitar errores en el catch

        try {
            // 📌 1️⃣ Convertir el JSON String a un objeto UserAdminDtoEntrance
            userAdminDtoEntrance = objectMapper.readValue(userJson, UserAdminDtoEntrance.class);

            // 📌 2️⃣ Validar los datos manualmente
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<UserAdminDtoEntrance>> violations = validator.validate(userAdminDtoEntrance);

            if (!violations.isEmpty()) {
                List<String> errorMessages = violations.stream()
                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                        .toList();

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<TokenDtoExit>builder()
                                .status(HttpStatus.BAD_REQUEST)
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .message("Errores de validación encontrados.")
                                .data(null)
                                .error(String.join(", ", errorMessages))
                                .build());
            }

            // 📌 3️⃣ Llamar al servicio para crear el usuario administrador
            TokenDtoExit tokenDtoExit = userService.createUserAdmin(file, userAdminDtoEntrance);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Usuario admin creado con éxito.")
                            .data(tokenDtoExit)
                            .error(null)
                            .build());

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.CONFLICT)
                            .statusCode(HttpStatus.CONFLICT.value())
                            .message("El correo electrónico ingresado ya está en uso.")
                            .data(null)
                            .error(e.getMessage())
                            .build());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error interno en el servidor.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }*/


    @PostMapping(value = "/create/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<TokenDtoExit>> createUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws MessagingException {

        UserDtoEntrance userDtoEntrance = null; // 👈 Inicialización para evitar errores en el catch

        try {
            // 📌 1️⃣ Convertir el JSON String a un objeto UserDtoEntrance
            userDtoEntrance = objectMapper.readValue(userJson, UserDtoEntrance.class);

            // 📌 2️⃣ Validar los datos manualmente
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            Set<ConstraintViolation<UserDtoEntrance>> violations = validator.validate(userDtoEntrance);

            if (!violations.isEmpty()) {
                List<String> errorMessages = violations.stream()
                        .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                        .toList();

                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.<TokenDtoExit>builder()
                                .status(HttpStatus.BAD_REQUEST)
                                .statusCode(HttpStatus.BAD_REQUEST.value())
                                .message("Errores de validación encontrados.")
                                .data(null)
                                .error(String.join(", ", errorMessages))
                                .build());
            }

            // 📌 3️⃣ Llamar al servicio para crear el usuario
            TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, file);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Usuario creado con éxito.")
                            .data(tokenDtoExit) // 👈 Devuelve TokenDtoExit en data
                            .error(null)
                            .build());

        } catch (DataIntegrityViolationException e) {
           // LOGGER.error("Error: Correo en uso", e);

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.CONFLICT)
                            .statusCode(HttpStatus.CONFLICT.value())
                            .message("El correo electrónico ingresado ya está en uso.")
                            .data(null)
                            .error(e.getMessage())
                            .build());

        } catch (Exception e) {
          //  LOGGER.error("Error inesperado al crear usuario", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error interno en el servidor.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDtoExit>> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance) {
        try {
            TokenDtoExit tokenDtoExit = userService.loginUserAndCheckEmail(loginDtoEntrance);

            return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Inicio de sesión exitoso.")
                    .data(tokenDtoExit)
                    .error(null)
                    .build());

        } catch (ResourceNotFoundException e) {
            // 📌 Maneja el caso en que el correo no existe en la DB
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("Usuario no encontrado.")
                            .data(null)
                            .error(e.getMessage()) // Mensaje detallado con el correo faltante
                            .build());

        } catch (AuthenticationException e) {
            // 📌 Maneja credenciales incorrectas (usuario sí existe, pero contraseña incorrecta)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Autenticación fallida. Verifique sus credenciales.")
                            .data(null)
                            .error(e.getMessage())
                            .build());

        } catch (Exception e) {
            // 📌 Maneja errores inesperados
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }
}
