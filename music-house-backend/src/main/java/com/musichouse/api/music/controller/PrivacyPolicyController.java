package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PrivacyPolicyDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PrivacyPolicyDtoExit;
import com.musichouse.api.music.dto.dto_modify.PrivacyPolicyDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.PrivacyPolicyService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/privacy-policy")
public class PrivacyPolicyController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PrivacyPolicyController.class);
    private final PrivacyPolicyService privacyPolicyService;

    // 🔹 CREAR POLÍTICA DE PRIVACIDAD
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PrivacyPolicyDtoExit>> createPrivacyPolicy(@Valid @RequestBody PrivacyPolicyDtoEntrance privacyPolicyDtoEntrance) {
        PrivacyPolicyDtoExit createdPrivacyPolicy = privacyPolicyService.createPrivacyPolicy(privacyPolicyDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PrivacyPolicyDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Política de privacidad creada con éxito.")
                        .data(createdPrivacyPolicy)
                        .error(null)
                        .build());
    }

    // 🔹 OBTENER TODAS LAS POLÍTICAS DE PRIVACIDAD
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PrivacyPolicyDtoExit>>> getAllPrivacyPolicies() {
        List<PrivacyPolicyDtoExit> privacyPolicies = privacyPolicyService.getAllPrivacyPolicy();

        return ResponseEntity.ok(ApiResponse.<List<PrivacyPolicyDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de políticas de privacidad obtenida con éxito.")
                .data(privacyPolicies)
                .error(null)
                .build());
    }

    // 🔹 ACTUALIZAR POLÍTICA DE PRIVACIDAD
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<PrivacyPolicyDtoExit>> updatePrivacyPolicy(@Valid @RequestBody PrivacyPolicyDtoModify privacyPolicyDtoModify) throws ResourceNotFoundException {
        PrivacyPolicyDtoExit updatedPrivacyPolicy = privacyPolicyService.updatePrivacyPolicy(privacyPolicyDtoModify);

        return ResponseEntity.ok(ApiResponse.<PrivacyPolicyDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Política de privacidad actualizada con éxito.")
                .data(updatedPrivacyPolicy)
                .error(null)
                .build());
    }

    // 🔹 ELIMINAR POLÍTICA DE PRIVACIDAD
    @DeleteMapping("/delete/{idPrivacyPolicy}")
    public ResponseEntity<ApiResponse<Void>> deletePrivacyPolicy(@PathVariable UUID idPrivacyPolicy) throws ResourceNotFoundException {
        privacyPolicyService.deleteidPrivacyPolicy(idPrivacyPolicy);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Política de privacidad eliminada exitosamente.")
                .data(null)
                .error(null)
                .build());
    }
}
