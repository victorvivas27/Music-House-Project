package com.musichouse.api.music.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserAdminDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.UserService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/create/admin")
    public ResponseEntity<ApiResponse<TokenDtoExit>> createUserAdmin(
            @RequestBody @Valid UserAdminDtoEntrance userAdminDtoEntrance) {
        try {
            TokenDtoExit tokenDtoExit = userService.createUserAdmin(userAdminDtoEntrance);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .message("Usuario admin creado con éxito.")
                            .data(tokenDtoExit)
                            .build());

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .message("El correo electrónico ingresado ya está en uso.")
                            .data(null)
                            .build());

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<TokenDtoExit>builder()
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .build());
        }
    }

    @PostMapping(value = "/create/user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(
            @RequestParam("user") String userJson,  // Se recibe el JSON como String
            @RequestPart("file") MultipartFile file // Se recibe el archivo como MultipartFile
    ) {
        try {
            // Convertir el JSON String a un objeto UserDtoEntrance
            UserDtoEntrance userDtoEntrance = objectMapper.readValue(userJson, UserDtoEntrance.class);

            // Llamar al servicio para crear el usuario
            TokenDtoExit tokenDtoExit = userService.createUser(userDtoEntrance, file);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Usuario creado con éxito.", tokenDtoExit));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("El correo electrónico ingresado ya está en uso.", null));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginDtoEntrance loginDtoEntrance) {
        try {
            TokenDtoExit tokenDtoSalida = userService.loginUserAndCheckEmail(loginDtoEntrance);
            return ResponseEntity.ok(tokenDtoSalida);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>("Autenticación fallida. Verifique sus credenciales.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Usuario no encontrado con el correo electrónico proporcionado.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
