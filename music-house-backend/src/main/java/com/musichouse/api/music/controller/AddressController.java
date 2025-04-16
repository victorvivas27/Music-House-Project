package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.AddressAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AddressDtoExit;
import com.musichouse.api.music.dto.dto_modify.AddressDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.address.AddressService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;

    // 🔹 CREAR DIRECCIÓN
    @PostMapping()
    public ResponseEntity<ApiResponse<AddressDtoExit>> createAddress(@Valid @RequestBody AddressAddDtoEntrance addressAddDtoEntrance)
            throws ResourceNotFoundException {
        AddressDtoExit createdAddress = addressService.addAddress(addressAddDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AddressDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Dirección creada con éxito.")
                        .error(null)
                        .result(createdAddress)
                        .build());
    }


    // 🔹 BUSCAR DIRECCIÓN POR ID
    @GetMapping("/{idAddress}")
    public ResponseEntity<ApiResponse<AddressDtoExit>> searchAddressById(@PathVariable UUID idAddress)
            throws ResourceNotFoundException {
        AddressDtoExit foundAddress = addressService.getAddressById(idAddress);

        return ResponseEntity.ok(ApiResponse.<AddressDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Dirección encontrada con éxito.")
                .error(null)
                .result(foundAddress)
                .build());
    }

    // 🔹 ACTUALIZAR DIRECCIÓN
    @PutMapping()
    public ResponseEntity<ApiResponse<AddressDtoExit>> updateAddress(@Valid @RequestBody AddressDtoModify addressDtoModify)
            throws ResourceNotFoundException {
        AddressDtoExit updatedAddress = addressService.updateAddress(addressDtoModify);

        return ResponseEntity.ok(ApiResponse.<AddressDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Dirección actualizada con éxito.")
                .error(null)
                .result(updatedAddress)
                .build());
    }

    // 🔹 ELIMINAR DIRECCIÓN
    @DeleteMapping("/{idAddress}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(@PathVariable UUID idAddress)
            throws ResourceNotFoundException {
        addressService.deleteAddress(idAddress);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Dirección eliminada exitosamente.")
                .error(null)
                .result(null)
                .build());
    }
}


