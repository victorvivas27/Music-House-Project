package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.reservation.ReservationService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationService reservationService;

    // 🔹 CREAR RESERVA
    @PostMapping()
    public ResponseEntity<ApiResponse<ReservationDtoExit>> createReservation(
            @RequestBody @Valid ReservationDtoEntrance reservationDtoEntrance)
            throws MessagingException, IOException, ResourceNotFoundException {

        ReservationDtoExit reservationDtoExit = reservationService.createReservation(reservationDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ReservationDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Reserva creada con éxito.")
                        .error(null)
                        .result(reservationDtoExit)
                        .build());

    }


    // 🔹 BUSCAR RESERVAS POR ID DE USUARIO
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<ReservationDtoExit>>> getReservationsByUserId(@PathVariable UUID userId)
            throws ResourceNotFoundException {

        List<ReservationDtoExit> reservationDtoExits = reservationService.getReservationByUserId(userId);

        return ResponseEntity.ok(ApiResponse.<List<ReservationDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Reservas encontradas con éxito para el usuario con ID: " + userId)
                .error(null)
                .result(reservationDtoExits)
                .build());

    }

    // 🔹 ELIMINAR RESERVA
    @DeleteMapping("/{idInstrument}/{idUser}/{idReservation}")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(
            @PathVariable UUID idInstrument,
            @PathVariable UUID idUser,
            @PathVariable UUID idReservation)
            throws ResourceNotFoundException {

        reservationService.deleteReservation(idInstrument, idUser, idReservation);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Reserva eliminada con éxito.")
                .error(null)
                .result(null)
                .build());

    }
}