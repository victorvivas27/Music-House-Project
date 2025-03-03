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

    private final AvailableDateService availableDateService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<?>> addAvailableDates(@RequestBody @Valid List<AvailableDateDtoEntrance> availableDatesDtoList) {
        try {
            List<AvailableDateDtoExit> addedDates = availableDateService.addAvailableDates(availableDatesDtoList);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Fechas disponibles agregadas exitosamente.", addedDates));
        } catch (PastDateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró el instrumento con el ID proporcionado", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> getAllAvailableDates() {
        List<AvailableDateDtoExit> availableDates = availableDateService.getAllAvailableDates();
        ApiResponse<List<AvailableDateDtoExit>> response =
                new ApiResponse<>("Lista de fechas disponibles exitosa.", availableDates);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idAvailableDate}")
    public ResponseEntity<?> searchAvailableDateById(@PathVariable UUID idAvailableDate) {
        try {
            AvailableDateDtoExit availableDateDtoExit = availableDateService.getAvailableDateById(idAvailableDate);
            return ResponseEntity.ok(new ApiResponse<>("Fecha disponible encontrada con éxito.", availableDateDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la fecha disponible con el ID :" + idAvailableDate, null));
        }
    }

    @GetMapping("/find/all/{idInstrument}/instrument")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAllAvailableDatesByInstrumentId(
            @PathVariable UUID idInstrument) {
        try {
            List<AvailableDateDtoExit> availableDates = availableDateService.findByInstrumentIdInstrument(idInstrument);
            return ResponseEntity.ok(new ApiResponse<>("Lista de fechas disponibles asociadas al instrumento exitosa.", availableDates));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateAvailableDate(@RequestBody @Valid AvailableDateDtoModify availableDateDtoModify) {
        try {
            AvailableDateDtoExit availableDateDtoExit = availableDateService.updateAvailableDate(availableDateDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Fecha disponible actualizada con éxito.", availableDateDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>
                            ("No se encontró la fecha disponible con el ID :" + availableDateDtoModify.getIdAvailableDate(), null));
        }
    }

    @DeleteMapping("/delete/{idInstrument}/{idAvailableDate}")
    public ResponseEntity<ApiResponse<String>> deleteAvailableDate(@PathVariable UUID idInstrument, @PathVariable UUID idAvailableDate) {
        try {
            availableDateService.deleteAvailableDate(idInstrument, idAvailableDate);
            return ResponseEntity.ok(new ApiResponse<>("Fecha disponible eliminada exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/find/all/{dateAvailable}")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAllInstrumentsOfADates(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAvailable) {
        try {
            if (dateAvailable.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden buscar fechas pasadas.");
            }
            List<AvailableDateDtoExit> availableDates = availableDateService.findAllInstrumentsOfADates(dateAvailable);
            return ResponseEntity.ok(new ApiResponse<>("Lista de fechas disponibles exitosa.", availableDates));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/find/all/{dateAvailable}/{idInstrument}")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAllAvailableDatesByInstrumentId(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateAvailable,
            @PathVariable UUID idInstrument) {
        try {
            if (dateAvailable.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden buscar fechas pasadas.");
            }
            List<AvailableDateDtoExit> availableDates = availableDateService.findAllAvailableDatesByInstrumentId(dateAvailable, idInstrument);
            return ResponseEntity.ok(new ApiResponse<>("Lista de fechas disponibles exitosa.", availableDates));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/find/all/{startDate}/between/{endDate}")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAllInstrumentByDatesRange(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de finalización.");
            } else if (startDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden buscar fechas pasadas.");
            }
            List<AvailableDateDtoExit> availableDates = availableDateService.findAllInstrumentByDatesRange(startDate, endDate);
            return ResponseEntity.ok(new ApiResponse<>("Lista de fechas disponibles exitosa.", availableDates));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/find/all/{startDate}/between/{endDate}/{idInstrument}")
    public ResponseEntity<ApiResponse<List<AvailableDateDtoExit>>> findAvailableDatesByInstrumentIDAndRange(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @PathVariable UUID idInstrument) {
        try {
            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de finalización.");
            } else if (startDate.isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden buscar fechas pasadas.");
            }
            List<AvailableDateDtoExit> availableDates = availableDateService.findAvailableDatesByInstrumentIDAndRange(startDate, endDate, idInstrument);
            return ResponseEntity.ok(new ApiResponse<>("Lista de fechas disponibles exitosa.", availableDates));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

}
