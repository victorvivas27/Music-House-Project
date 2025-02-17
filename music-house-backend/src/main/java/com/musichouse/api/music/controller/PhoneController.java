package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.PhoneService;
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
@RequestMapping("/api/phone")
public class PhoneController {
    private final PhoneService phoneService;

    @PostMapping("/add_phone")
    public ResponseEntity<ApiResponse<?>> addPhone(@Valid @RequestBody PhoneAddDtoEntrance phoneAddDtoEntrance) throws ResourceNotFoundException {
        try {
            PhoneDtoExit createPhone = phoneService.addPhone(phoneAddDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("Telefono creado con éxito.", createPhone));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("No se encontró el usuario con el ID proporcionado.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<PhoneDtoExit>>> allPhone() {
        List<PhoneDtoExit> phoneDtoExits = phoneService.getAllPhone();
        ApiResponse<List<PhoneDtoExit>> response =
                new ApiResponse<>("Lista de Telefonos exitosa.", phoneDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idPhone}")
    public ResponseEntity<?> searchPhoneById(@PathVariable UUID idPhone) throws ResourceNotFoundException {
        try {
            PhoneDtoExit foundPhone = phoneService.getPhoneById(idPhone);
            return ResponseEntity.ok(new ApiResponse<>("Telefono encontrado con exito.", foundPhone));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró el telefono con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatepPhone(@Valid @RequestBody PhoneDtoModify phoneDtoModify) throws ResourceNotFoundException {
        try {
            PhoneDtoExit phoneDtoExit = phoneService.updatePhone(phoneDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Telefono actualizado con éxito.", phoneDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró El telefono con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idPhone}")
    public ResponseEntity<ApiResponse<String>> deletePhone(@PathVariable UUID idPhone) {
        try {
            phoneService.deletePhone(idPhone);
            return ResponseEntity.ok(new ApiResponse<>("Telefono eliminado exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("El  Telefono con el ID proporcionado no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
