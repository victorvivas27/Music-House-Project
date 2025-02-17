package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ChangeOfRole;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.RoleService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/user/rol/add")
    public ResponseEntity<ApiResponse<Void>> addRoleToUser(@RequestBody @Valid ChangeOfRole changeOfRole) {
        try {
            roleService.addRoleToUser(changeOfRole);
            return ResponseEntity.ok(new ApiResponse<>("Rol " + changeOfRole.getRol() + " agregado al usuario con ID " + changeOfRole.getIdUser() + " exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @DeleteMapping("/user/rol/delete")
    public ResponseEntity<ApiResponse<Void>> removeRoleFromUser(@RequestBody @Valid ChangeOfRole changeOfRole) {
        try {
            roleService.removeRoleFromUser(changeOfRole);
            return ResponseEntity.ok(new ApiResponse<>("Rol " + changeOfRole.getRol() + " eliminado del usuario con ID " + changeOfRole.getIdUser() + " exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
