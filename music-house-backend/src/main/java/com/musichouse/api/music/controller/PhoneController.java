package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.phone.PhoneService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/phones")
public class PhoneController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PhoneController.class);
    private final PhoneService phoneService;

    // 🔹 CREAR TELÉFONO NUEVO
    @PostMapping()
    public ResponseEntity<ApiResponse<PhoneDtoExit>> addPhone(@Valid @RequestBody PhoneAddDtoEntrance phoneAddDtoEntrance)
            throws ResourceNotFoundException {
        PhoneDtoExit createdPhone = phoneService.addPhone(phoneAddDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PhoneDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Teléfono creado con éxito.")
                        .error(null)
                        .result(createdPhone)
                        .build());
    }


    // 🔹 BUSCAR TELÉFONO POR ID
    @GetMapping("/{idPhone}")
    public ResponseEntity<ApiResponse<PhoneDtoExit>> getPhoneById(@PathVariable UUID idPhone)
            throws ResourceNotFoundException {
        PhoneDtoExit foundPhone = phoneService.getPhoneById(idPhone);

        return ResponseEntity.ok(ApiResponse.<PhoneDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono encontrado con éxito.")
                .error(null)
                .result(foundPhone)
                .build());
    }

    // 🔹 ACTUALIZAR TELÉFONO
    @PutMapping()
    public ResponseEntity<ApiResponse<PhoneDtoExit>> updatePhone(@Valid @RequestBody PhoneDtoModify phoneDtoModify)
            throws ResourceNotFoundException {
        PhoneDtoExit updatedPhone = phoneService.updatePhone(phoneDtoModify);

        return ResponseEntity.ok(ApiResponse.<PhoneDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono actualizado con éxito.")
                .error(null)
                .result(updatedPhone)
                .build());
    }

    // 🔹 ELIMINAR TELÉFONO
    @DeleteMapping("/{idPhone}")
    public ResponseEntity<ApiResponse<Void>> deletePhone(@PathVariable UUID idPhone)
            throws ResourceNotFoundException {
        phoneService.deletePhone(idPhone);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono eliminado exitosamente.")
                .error(null)
                .result(null)
                .build());
    }
}
