package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_exit.CharacteristicDtoExit;
import com.musichouse.api.music.dto.dto_modify.CharacteristicDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.CharacteristicService;
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
@RequestMapping("/api/characteristic")
public class CharacteristicController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CharacteristicController.class);
    private final CharacteristicService characteristicService;

    // 🔹 OBTENER TODAS LAS CARACTERÍSTICAS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CharacteristicDtoExit>>> getAllCharacteristics() {
        List<CharacteristicDtoExit> characteristics = characteristicService.getAllCharacteristic();

        return ResponseEntity.ok(ApiResponse.<List<CharacteristicDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de características obtenida con éxito.")
                .data(characteristics)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR CARACTERÍSTICA POR ID
    @GetMapping("/search/{idCharacteristics}")
    public ResponseEntity<ApiResponse<CharacteristicDtoExit>> getCharacteristicById(@PathVariable UUID idCharacteristics) throws ResourceNotFoundException {
        CharacteristicDtoExit foundCharacteristic = characteristicService.getCharacteristicById(idCharacteristics);

        return ResponseEntity.ok(ApiResponse.<CharacteristicDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Característica encontrada con éxito.")
                .data(foundCharacteristic)
                .error(null)
                .build());
    }

    // 🔹 ACTUALIZAR CARACTERÍSTICA
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CharacteristicDtoExit>> updateCharacteristic(
            @Valid @RequestBody CharacteristicDtoModify characteristicDtoModify) throws ResourceNotFoundException {

        CharacteristicDtoExit updatedCharacteristic = characteristicService.updateCharacteristic(characteristicDtoModify);

        return ResponseEntity.ok(ApiResponse.<CharacteristicDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Característica actualizada con éxito.")
                .data(updatedCharacteristic)
                .error(null)
                .build());
    }
}
