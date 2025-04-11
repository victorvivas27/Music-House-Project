package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.instrument.InstrumentService;
import com.musichouse.api.music.util.ApiResponse;
import com.musichouse.api.music.util.FileValidatorUtils;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/instruments")
public class InstrumentController {

    private static final Logger LOGGER = LoggerFactory.getLogger(InstrumentController.class);
    private final InstrumentService instrumentService;
    private final ObjectMapper objectMapper;
    private Validator validator;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<InstrumentDtoExit>> createInstrument(
            @RequestPart("instrument") String instrumentJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) throws JsonProcessingException, ResourceNotFoundException {


        InstrumentDtoEntrance instrumentDtoEntrance = objectMapper.readValue(instrumentJson, InstrumentDtoEntrance.class);


        Set<ConstraintViolation<InstrumentDtoEntrance>> violations = validator.validate(instrumentDtoEntrance);
        List<String> dtoErrors = violations.stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList();


        List<String> fileErrors = new ArrayList<>();
        if (files != null) {
            for (MultipartFile file : files) {
                fileErrors.addAll(FileValidatorUtils.validateImages(files));
            }
        }


        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(dtoErrors);
        allErrors.addAll(fileErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<InstrumentDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }


        InstrumentDtoExit instrumentDtoExit = instrumentService.createInstrument(files, instrumentDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<InstrumentDtoExit>builder()
                .status(HttpStatus.CREATED)
                .statusCode(HttpStatus.CREATED.value())
                .message("Instrumento creado exitosamente.")
                .error(null)
                .result(instrumentDtoExit)
                .build());
    }

    // 🔹 OBTENER TODOS LOS INSTRUMENTOS
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<InstrumentDtoExit>>> getAllInstruments(Pageable pageable) {

        Page<InstrumentDtoExit> instrumentDtoExits = instrumentService.getAllInstruments(pageable);

        return ResponseEntity.ok(ApiResponse.<Page<InstrumentDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de instrumentos obtenida con éxito.")
                .error(null)
                .result(instrumentDtoExits)
                .build());
    }

    // 🔹 BUSCAR INSTRUMENTO POR ID
    @GetMapping("{idInstrument}")
    public ResponseEntity<ApiResponse<InstrumentDtoExit>> getInstrumentById(@PathVariable UUID idInstrument)
            throws ResourceNotFoundException {

        InstrumentDtoExit foundInstrument = instrumentService.getInstrumentById(idInstrument);

        return ResponseEntity.ok(ApiResponse.<InstrumentDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento encontrado con éxito.")
                .error(null)
                .result(foundInstrument)
                .build());
    }

    // 🔹 ACTUALIZAR INSTRUMENTO
    @PutMapping()
    public ResponseEntity<ApiResponse<?>> updateInstrument(
            @Valid @RequestBody InstrumentDtoModify instrumentDtoModify) throws ResourceNotFoundException {


        InstrumentDtoExit instrumentDtoExit = instrumentService.updateInstrument(instrumentDtoModify);

        return ResponseEntity.ok(ApiResponse.<InstrumentDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento actualizado con éxito.")
                .error(null)
                .result(instrumentDtoExit)
                .build());


    }

    // 🔹 ELIMINAR INSTRUMENTO
    @DeleteMapping("{idInstrument}")
    public ResponseEntity<ApiResponse<Void>> deleteInstrument(@PathVariable UUID idInstrument) throws ResourceNotFoundException {
        instrumentService.deleteInstrument(idInstrument);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento eliminado exitosamente.")
                .error(null)
                .result(null)
                .build());
    }

    // 🔹 BUSCAR INSTRUMENTOS POR NOMBRE
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<InstrumentDtoExit>>> searchInstrumentByName(
            @RequestParam String name,
            Pageable pageable) {


        Page<InstrumentDtoExit> instrumentDtoExits = instrumentService.searchInstrument(name, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<InstrumentDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda de tematicas exitosa.")
                .error(null)
                .result(instrumentDtoExits)
                .build());


    }
}




