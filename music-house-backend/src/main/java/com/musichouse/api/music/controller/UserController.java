package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.dto.dto_exit.UserDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.user.UserService;
import com.musichouse.api.music.util.ApiResponse;
import com.musichouse.api.music.util.FileValidatorUtils;
import jakarta.mail.MessagingException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final static Logger LOGGER = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;
    private final ObjectMapper objectMapper;
    private Validator validator;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<TokenDtoExit>> createUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws JsonProcessingException, MessagingException {


        // 📌 1️⃣ Convertir el JSON String a un objeto UserDtoEntrance
        UserDtoEntrance userDtoEntrance = objectMapper.readValue(userJson, UserDtoEntrance.class);

        // 2. Validar archivos subidos
        List<String> fileErrors = FileValidatorUtils.validateImage(file);

        // 3. Validar DTO manualmente (porque viene como JSON string)
        Set<ConstraintViolation<UserDtoEntrance>> violations = validator.validate(userDtoEntrance);
        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        // 4. Unificar errores
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }

        // 5. Crear usuario
        TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, file);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<TokenDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Usuario creado con éxito.")
                        .error(null)
                        .result(tokenDtoExit)
                        .build());

    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenDtoExit>> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance)
            throws ResourceNotFoundException {
        try {
            TokenDtoExit tokenDtoExit = userService.loginUserAndCheckEmail(loginDtoEntrance);

            return ResponseEntity.ok(ApiResponse.<TokenDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Inicio de sesión exitoso.")
                    .error(null)
                    .result(tokenDtoExit)
                    .build());


        } catch (AuthenticationException e) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .status(HttpStatus.UNAUTHORIZED)
                            .statusCode(HttpStatus.UNAUTHORIZED.value())
                            .message("Autenticación fallida. Verifique sus credenciales.")
                            .error(e.getMessage())
                            .result(null)
                            .build());

        }
    }


    // 🔹 OBTENER TODOS LOS USUARIOS
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<UserDtoExit>>> getAllUsers(Pageable pageable) {

        Page<UserDtoExit> userDtoExits = userService.getAllUser(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<UserDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de usuarios obtenida con éxito.")
                .error(null)
                .result(userDtoExits)
                .build());


    }

    // 🔹 OBTENER USUARIO POR ID
    @GetMapping("{idUser}")
    public ResponseEntity<ApiResponse<UserDtoExit>> getUserById(@PathVariable UUID idUser)
            throws ResourceNotFoundException {

        UserDtoExit foundUser = userService.getUserById(idUser);

        return ResponseEntity.ok(ApiResponse.<UserDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario encontrado con éxito.")
                .error(null)
                .result(foundUser)
                .build());

    }

    // 🔹 ACTUALIZAR USUARIO
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HttpEntity<ApiResponse<UserDtoExit>> updateUser(
            @RequestParam("user") String userJson,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws JsonProcessingException, MessagingException, ResourceNotFoundException {


        // 📌 1️⃣ Convertir el JSON String a un objeto UserDtoEntrance
        UserDtoModify userDtoModify = objectMapper.readValue(userJson, UserDtoModify.class);

        // 2. Validar archivos subidos
        List<String> fileErrors = FileValidatorUtils.validateImage(file);

        // 3. Validar DTO manualmente (porque viene como JSON string)
        Set<ConstraintViolation<UserDtoModify>> violations = validator.validate(userDtoModify);

        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        // 4. Unificar errores
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }

        // 5. Crear usuario
        UserDtoExit userDtoExit = userService.updateUser(userDtoModify, file);


        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<UserDtoExit>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Usuario modificado con éxito.")
                        .error(null)
                        .result(userDtoExit)
                        .build());

    }


    // 🔹 ELIMINAR USUARIO
    @DeleteMapping("{idUser}")
    public ResponseEntity<ApiResponse<?>> deleteUser(@PathVariable UUID idUser)
            throws ResourceNotFoundException {

        userService.deleteUser(idUser);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Usuario con ID " + idUser + " eliminado exitosamente.")
                .error(null)
                .result(null)
                .build());


    }

    // 🔹 BUSCAR USUARIO POR NOMBRE
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserDtoExit>>> searchThemeByName(
            @RequestParam String name,
            Pageable pageable) {


        Page<UserDtoExit> userDtoExits = userService.searchUserName(name, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<UserDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda usuarios por nombre.")
                .error(null)
                .result(userDtoExits)
                .build());


    }
}