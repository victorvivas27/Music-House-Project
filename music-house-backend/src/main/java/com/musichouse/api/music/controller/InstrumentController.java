package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.InstrumentService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.*;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/instrument")
public class InstrumentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(InstrumentController.class);
    private final InstrumentService instrumentService;
    private final ObjectMapper objectMapper;

    // 🔹 CREAR INSTRUMENTO
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<InstrumentDtoExit>> createInstrument(
            @RequestPart("instrument") String instrumentJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {
            // 📌 Convertir JSON a Objeto
            InstrumentDtoEntrance instrumentDtoEntrance = objectMapper.readValue(instrumentJson, InstrumentDtoEntrance.class);

            // 📌 Llamar al servicio
            InstrumentDtoExit instrumentDtoExit = instrumentService.createInstrument(files, instrumentDtoEntrance);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<InstrumentDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Instrumento creado exitosamente.")
                            .data(instrumentDtoExit)
                            .error(null)
                            .build());

        } catch (Exception e) {
            LOGGER.error("❌ Error al crear instrumento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<InstrumentDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Error inesperado al crear el instrumento")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 OBTENER TODOS LOS INSTRUMENTOS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<InstrumentDtoExit>>> getAllInstruments() {
        List<InstrumentDtoExit> instrumentDtoExits = instrumentService.getAllInstruments();

        return ResponseEntity.ok(ApiResponse.<List<InstrumentDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de instrumentos obtenida con éxito.")
                .data(instrumentDtoExits)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR INSTRUMENTO POR ID
    @GetMapping("/search/{idInstrument}")
    public ResponseEntity<ApiResponse<InstrumentDtoExit>> getInstrumentById(@PathVariable UUID idInstrument) throws ResourceNotFoundException {
        InstrumentDtoExit foundInstrument = instrumentService.getInstrumentById(idInstrument);

        return ResponseEntity.ok(ApiResponse.<InstrumentDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento encontrado con éxito.")
                .data(foundInstrument)
                .error(null)
                .build());
    }

    // 🔹 ACTUALIZAR INSTRUMENTO
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<InstrumentDtoExit>> updateInstrument(@Valid @RequestBody InstrumentDtoModify instrumentDtoModify) throws ResourceNotFoundException {
        InstrumentDtoExit instrumentDtoExit = instrumentService.updateInstrument(instrumentDtoModify);

        return ResponseEntity.ok(ApiResponse.<InstrumentDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento actualizado con éxito.")
                .data(instrumentDtoExit)
                .error(null)
                .build());
    }

    // 🔹 ELIMINAR INSTRUMENTO
    @DeleteMapping("/delete/{idInstrument}")
    public ResponseEntity<ApiResponse<Void>> deleteInstrument(@PathVariable UUID idInstrument) throws ResourceNotFoundException {
        instrumentService.deleteInstrument(idInstrument);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento eliminado exitosamente.")
                .data(null)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR INSTRUMENTOS POR NOMBRE
    @GetMapping("/find/name/{name}")
    public ResponseEntity<ApiResponse<List<InstrumentDtoExit>>> searchInstrumentsByName(@PathVariable String name) {
        List<InstrumentDtoExit> instruments = instrumentService.searchInstruments(name);

        if (instruments.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<List<InstrumentDtoExit>>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontraron instrumentos con el nombre proporcionado.")
                            .data(null)
                            .error(null)
                            .build());
        }

        return ResponseEntity.ok(ApiResponse.<List<InstrumentDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumentos encontrados con éxito.")
                .data(instruments)
                .error(null)
                .build());
    }
}




