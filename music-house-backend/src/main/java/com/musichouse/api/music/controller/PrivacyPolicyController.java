package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PrivacyPolicyDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PrivacyPolicyDtoExit;
import com.musichouse.api.music.dto.dto_modify.PrivacyPolicyDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.PrivacyPolicyService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
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
    private final PrivacyPolicyService privacyPolicyService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> addPhone(@Valid @RequestBody PrivacyPolicyDtoEntrance privacyPolicyDtoEntrance) throws ResourceNotFoundException {
        try {
            PrivacyPolicyDtoExit privacyPolicyDtoExit = privacyPolicyService.createPrivacyPolicy(privacyPolicyDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>
                    ("Politica de privacidadad creada con éxito.", privacyPolicyDtoExit));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PrivacyPolicyDtoExit>>> allPrivacyPolicy() {
        List<PrivacyPolicyDtoExit> privacyPolicyDtoExits = privacyPolicyService.getAllPrivacyPolicy();
        ApiResponse<List<PrivacyPolicyDtoExit>> response =
                new ApiResponse<>("Lista de Politica de Privacidad exitosa.", privacyPolicyDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePrivacyPolicy(@RequestBody @Valid PrivacyPolicyDtoModify privacyPolicyDtoModify) {
        try {
            PrivacyPolicyDtoExit privacyPolicyDtoExit = privacyPolicyService.updatePrivacyPolicy(privacyPolicyDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Politica de Privacidad actualizada con éxito.", privacyPolicyDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>
                            ("No se encontró la politica de privacidad  con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idPrivacyPolicy}")
    public ResponseEntity<?> deleteTheme(@PathVariable UUID idPrivacyPolicy) {
        try {
            privacyPolicyService.deleteidPrivacyPolicy(idPrivacyPolicy);
            return ResponseEntity.ok(new ApiResponse<>
                    ("Politica de privacidad con ID " +
                            idPrivacyPolicy + " eliminada exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>
                            ("La politica de privacidad con el ID "
                                    + idPrivacyPolicy + " no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }
}
