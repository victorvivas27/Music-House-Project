package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.availableDate.AvailableDateService;
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
    @PostMapping()
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> addAvailableDates(
            @RequestBody @Valid List<AvailableDateDtoEntrance> availableDatesDtoList)
            throws ResourceNotFoundException {

        List<AvailableDateDtoExit> addedDates = availableDateService.addAvailableDates(availableDatesDtoList);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<List<AvailableDateDtoExit>>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Fechas disponibles agregadas exitosamente.")
                        .error(null)
                        .result(addedDates)
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
                .error(null)
                .result(availableDates)
                .build());
    }


    @GetMapping("/{idInstrument}")
    public ResponseEntity<ApiResponse<List<?>>> findAllAvailableDatesByInstrumentId(
            @PathVariable UUID idInstrument) throws ResourceNotFoundException {

        List<AvailableDateDtoExit> availableDates = availableDateService.findByInstrumentIdInstrument(idInstrument);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<List<?>>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Lista de fechas disponibles asociadas al instrumento exitosa.")
                        .error(null)
                        .result(availableDates)
                        .build());


    }
}
