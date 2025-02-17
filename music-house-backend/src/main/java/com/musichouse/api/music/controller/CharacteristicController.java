package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_exit.CharacteristicDtoExit;
import com.musichouse.api.music.dto.dto_modify.CharacteristicDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.CharacteristicService;
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
@RequestMapping("/api/characteristic")
public class CharacteristicController {

    private final CharacteristicService characteristicService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CharacteristicDtoExit>>> allCharacteristics() {
        List<CharacteristicDtoExit> characteristicDtoExits = characteristicService.getAllCharacteristic();
        ApiResponse<List<CharacteristicDtoExit>> response =
                new ApiResponse<>("Lista de Carcateristicas exitosa.", characteristicDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idCharacteristics}")
    public ResponseEntity<ApiResponse<?>> searchCharacteristicById(@PathVariable UUID idCharacteristics) {
        try {
            CharacteristicDtoExit foundCharacteristic = characteristicService.getCharacteristicById(idCharacteristics);
            return ResponseEntity.ok(new ApiResponse<>("Caracteristica encontrado.", foundCharacteristic));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la caracteristica con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateUser(@Valid @RequestBody CharacteristicDtoModify characteristicDtoModify) {
        try {
            CharacteristicDtoExit characteristicDtoExit = characteristicService.updateCharacteristic(characteristicDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Caracteristicas actualizadas con éxito.", characteristicDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontro la caracteristica con el ID proporcionado.", null));
        }
    }
}
