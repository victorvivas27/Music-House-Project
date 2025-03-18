package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ChangeOfRole;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.RoleService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/roles")
public class RoleController {

    private static final Logger LOGGER = LoggerFactory.getLogger(RoleController.class);
    private final RoleService roleService;

    // 🔹 AGREGAR ROL A UN USUARIO
    @PostMapping("/user/rol/add")
    public ResponseEntity<ApiResponse<Void>> addRoleToUser(@RequestBody @Valid ChangeOfRole changeOfRole) {
        try {
            roleService.addRoleToUser(changeOfRole);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Rol '" + changeOfRole.getRol() + "' agregado exitosamente al usuario con ID: " + changeOfRole.getIdUser())
                    .data(null)
                    .error(null)
                    .build());
        } catch (ResourceNotFoundException e) {
            LOGGER.error("Error: Usuario o rol no encontrado - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró el usuario o el rol especificado.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        } catch (Exception e) {
            LOGGER.error("Error inesperado en addRoleToUser", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 ELIMINAR ROL DE UN USUARIO
    @DeleteMapping("/user/rol/delete")
    public ResponseEntity<ApiResponse<Void>> removeRoleFromUser(@RequestBody @Valid ChangeOfRole changeOfRole) {
        try {
            roleService.removeRoleFromUser(changeOfRole);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Rol '" + changeOfRole.getRol() + "' eliminado exitosamente del usuario con ID: " + changeOfRole.getIdUser())
                    .data(null)
                    .error(null)
                    .build());
        } catch (ResourceNotFoundException e) {
            LOGGER.error("Error: Usuario o rol no encontrado - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró el usuario o el rol especificado.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        } catch (Exception e) {
            LOGGER.error("Error inesperado en removeRoleFromUser", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }
}
