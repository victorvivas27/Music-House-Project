package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.PhoneService;
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
@RequestMapping("/api/phone")
public class PhoneController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PhoneController.class);
    private final PhoneService phoneService;

    // 🔹 CREAR TELÉFONO
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<PhoneDtoExit>> addPhone(@Valid @RequestBody PhoneAddDtoEntrance phoneAddDtoEntrance) throws ResourceNotFoundException {
        PhoneDtoExit createdPhone = phoneService.addPhone(phoneAddDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PhoneDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Teléfono creado con éxito.")
                        .data(createdPhone)
                        .error(null)
                        .build());
    }

    // 🔹 OBTENER TODOS LOS TELÉFONOS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PhoneDtoExit>>> getAllPhones() {
        List<PhoneDtoExit> phoneDtoExits = phoneService.getAllPhone();

        return ResponseEntity.ok(ApiResponse.<List<PhoneDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de teléfonos obtenida con éxito.")
                .data(phoneDtoExits)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR TELÉFONO POR ID
    @GetMapping("/search/{idPhone}")
    public ResponseEntity<ApiResponse<PhoneDtoExit>> getPhoneById(@PathVariable UUID idPhone) throws ResourceNotFoundException {
        PhoneDtoExit foundPhone = phoneService.getPhoneById(idPhone);

        return ResponseEntity.ok(ApiResponse.<PhoneDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono encontrado con éxito.")
                .data(foundPhone)
                .error(null)
                .build());
    }

    // 🔹 ACTUALIZAR TELÉFONO
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<PhoneDtoExit>> updatePhone(@Valid @RequestBody PhoneDtoModify phoneDtoModify) throws ResourceNotFoundException {
        PhoneDtoExit updatedPhone = phoneService.updatePhone(phoneDtoModify);

        return ResponseEntity.ok(ApiResponse.<PhoneDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono actualizado con éxito.")
                .data(updatedPhone)
                .error(null)
                .build());
    }

    // 🔹 ELIMINAR TELÉFONO
    @DeleteMapping("/delete/{idPhone}")
    public ResponseEntity<ApiResponse<Void>> deletePhone(@PathVariable UUID idPhone) throws ResourceNotFoundException {
        phoneService.deletePhone(idPhone);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Teléfono eliminado exitosamente.")
                .data(null)
                .error(null)
                .build());
    }
}
