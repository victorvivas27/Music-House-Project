package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.dto.dto_modify.AvailableDateDtoModify;
import com.musichouse.api.music.exception.PastDateException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.AvailableDateService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/available-dates")
public class AvailableDateController {

    private static final Logger LOGGER = LoggerFactory.getLogger(AvailableDateController.class);
    private final AvailableDateService availableDateService;

    // 🔹 AGREGAR FECHAS DISPONIBLES
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> addAvailableDates(
            @RequestBody @Valid List<AvailableDateDtoEntrance> availableDatesDtoList) throws ResourceNotFoundException {

        List<AvailableDateDtoExit> addedDates = availableDateService.addAvailableDates(availableDatesDtoList);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<List<AvailableDateDtoExit>>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Fechas disponibles agregadas exitosamente.")
                        .data(addedDates)
                        .error(null)
                        .build());
    }

    // 🔹 OBTENER TODAS LAS FECHAS DISPONIBLES
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> getAllAvailableDates() {
        List<AvailableDateDtoExit> availableDates = availableDateService.getAllAvailableDates();

        return ResponseEntity.ok(ApiResponse.<List<AvailableDateDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de fechas disponibles obtenida con éxito.")
                .data(availableDates)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR FECHA DISPONIBLE POR ID
    @GetMapping("/search/{idAvailableDate}")
    public ResponseEntity<ApiResponse<AvailableDateDtoExit>> searchAvailableDateById(@PathVariable UUID idAvailableDate) throws ResourceNotFoundException {
        AvailableDateDtoExit availableDateDtoExit = availableDateService.getAvailableDateById(idAvailableDate);

        return ResponseEntity.ok(ApiResponse.<AvailableDateDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Fecha disponible encontrada con éxito.")
                .data(availableDateDtoExit)
                .error(null)
                .build());
    }

    // 🔹 ACTUALIZAR FECHA DISPONIBLE
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<AvailableDateDtoExit>> updateAvailableDate(
            @RequestBody @Valid AvailableDateDtoModify availableDateDtoModify) throws ResourceNotFoundException {

        AvailableDateDtoExit updatedDate = availableDateService.updateAvailableDate(availableDateDtoModify);

        return ResponseEntity.ok(ApiResponse.<AvailableDateDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Fecha disponible actualizada con éxito.")
                .data(updatedDate)
                .error(null)
                .build());
    }

    // 🔹 ELIMINAR FECHA DISPONIBLE
    @DeleteMapping("/delete/{idInstrument}/{idAvailableDate}")
    public ResponseEntity<ApiResponse<String>> deleteAvailableDate(
            @PathVariable UUID idInstrument, @PathVariable UUID idAvailableDate) throws ResourceNotFoundException {

        availableDateService.deleteAvailableDate(idInstrument, idAvailableDate);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Fecha disponible eliminada exitosamente.")
                .data(null)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR FECHAS DISPONIBLES POR RANGO
    @GetMapping("/find/all/{startDate}/between/{endDate}")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAllInstrumentByDatesRange(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) throws ResourceNotFoundException {

        List<AvailableDateDtoExit> availableDates = availableDateService.findAllInstrumentByDatesRange(startDate, endDate);

        return ResponseEntity.ok(ApiResponse.<List<AvailableDateDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de fechas disponibles obtenida con éxito.")
                .data(availableDates)
                .error(null)
                .build());
    }
}
