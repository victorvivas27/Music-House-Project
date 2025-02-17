package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ReservationAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ReservationService;
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
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> createReservation(@RequestBody @Valid ReservationDtoEntrance reservationDtoEntrance) {
        try {
            ReservationDtoExit reservationDtoExit = reservationService.createReservation(reservationDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Reserva creada con exito.", reservationDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ReservationAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ReservationDtoExit>>> allReservation() {
        List<ReservationDtoExit> reservationDtoExits = reservationService.getAllReservation();
        ApiResponse<List<ReservationDtoExit>> response =
                new ApiResponse<>("Lista de Reservas exitosa.", reservationDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/user/{userId}")
    public ResponseEntity<?> searchReservationByUserId(@PathVariable UUID userId) {
        try {
            List<ReservationDtoExit> reservationDtoExits = reservationService.getReservationByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>("Reservas encontradas con éxito para el usuario con ID: " + userId, reservationDtoExits));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontraron reservas para el usuario con id: " + userId, null));
        }
    }

    @DeleteMapping("/delete/{idInstrument}/{idUser}/{idReservation}")
    public ResponseEntity<?> deleteReservation(
            @PathVariable UUID idInstrument, @PathVariable UUID idUser, @PathVariable UUID idReservation) {
        try {
            reservationService.deleteReservation(idInstrument, idUser, idReservation);
            return ResponseEntity.ok(new ApiResponse<>("Reserva eliminada con éxito.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
