package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ReservationAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ReservationService;
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
@RequestMapping("/api/reservations")
public class ReservationController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReservationController.class);
    private final ReservationService reservationService;

    // 🔹 CREAR RESERVA
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ReservationDtoExit>> createReservation(
            @RequestBody @Valid ReservationDtoEntrance reservationDtoEntrance) {
        try {
            ReservationDtoExit reservationDtoExit = reservationService.createReservation(reservationDtoEntrance);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<ReservationDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Reserva creada con éxito.")
                            .error(null)
                            .result(reservationDtoExit)
                            .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<ReservationDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message(e.getMessage())
                            .error(e.getMessage())
                            .result(null)
                            .build());
        } catch (ReservationAlreadyExistsException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.<ReservationDtoExit>builder()
                            .status(HttpStatus.CONFLICT)
                            .statusCode(HttpStatus.CONFLICT.value())
                            .message(e.getMessage())
                            .error(e.getMessage())
                            .result(null)
                            .build());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<ReservationDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 OBTENER TODAS LAS RESERVAS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ReservationDtoExit>>> getAllReservations() {
        List<ReservationDtoExit> reservationDtoExits = reservationService.getAllReservation();

        return ResponseEntity.ok(ApiResponse.<List<ReservationDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de reservas obtenida con éxito.")
                .error(null)
                .result(reservationDtoExits)
                .build());
    }

    // 🔹 BUSCAR RESERVAS POR ID DE USUARIO
    @GetMapping("/search/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReservationDtoExit>>> getReservationsByUserId(@PathVariable UUID userId) {
        try {
            List<ReservationDtoExit> reservationDtoExits = reservationService.getReservationByUserId(userId);

            return ResponseEntity.ok(ApiResponse.<List<ReservationDtoExit>>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Reservas encontradas con éxito para el usuario con ID: " + userId)
                    .error(null)
                    .result(reservationDtoExits)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<List<ReservationDtoExit>>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontraron reservas para el usuario con ID: " + userId)
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 ELIMINAR RESERVA
    @DeleteMapping("/delete/{idInstrument}/{idUser}/{idReservation}")
    public ResponseEntity<ApiResponse<Void>> deleteReservation(
            @PathVariable UUID idInstrument,
            @PathVariable UUID idUser,
            @PathVariable UUID idReservation) {
        try {
            reservationService.deleteReservation(idInstrument, idUser, idReservation);

            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Reserva eliminada con éxito.")
                    .error(null)
                    .result(null)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message(e.getMessage())
                            .error(e.getMessage())
                            .result(null)
                            .build());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }
}