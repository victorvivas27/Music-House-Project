package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.AddressAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AddressDtoExit;
import com.musichouse.api.music.dto.dto_modify.AddressDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.AddressService;
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
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/add_address")
    public ResponseEntity<?> createAddress(@Valid @RequestBody AddressAddDtoEntrance addressAddDtoEntrance) {
        try {
            AddressDtoExit createdAddress = addressService.addAddress(addressAddDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>("Direccion creado con éxito.", createdAddress));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("No se encontró el usuario con el ID proporcionado.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AddressDtoExit>>> allAddresses() {
        List<AddressDtoExit> addressDtoExits = addressService.getAllAddress();
        ApiResponse<List<AddressDtoExit>> response =
                new ApiResponse<>("Lista de Direcciones exitosa.", addressDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idAddress}")
    public ResponseEntity<?> searchAddressById(@PathVariable UUID idAddress) {
        try {
            AddressDtoExit foundAddres = addressService.getAddressById(idAddress);
            return ResponseEntity.ok(new ApiResponse<>("Direccion encontrado con exito.", foundAddres));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la direccion con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateAddress(@Valid @RequestBody AddressDtoModify addressDtoModify) {
        try {
            AddressDtoExit addressDtoExit = addressService.updateAddress(addressDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Direccion actualizado con éxito.", addressDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la direccion con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idAddress}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(@PathVariable UUID idAddress) {
        try {
            addressService.deleteAddress(idAddress);
            return ResponseEntity.ok(new ApiResponse<>("Dirección eliminada exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("La dirección con el ID proporcionado no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}


