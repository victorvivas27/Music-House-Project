package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ThemeService;
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
@RequestMapping("/api/themes")
public class ThemeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ThemeController.class);
    private final ThemeService themeService;
    private final ObjectMapper objectMapper;
    private Validator validator;

    // 🔹 CREAR TEMÁTICA
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ThemeDtoExit>> createTheme(
            @RequestPart("theme") String themeJson,
            @RequestPart(value = "files", required = false) List<MultipartFile> files)
            throws JsonProcessingException, ResourceNotFoundException {

        // 1. Parsear JSON a DTO
        ThemeDtoEntrance themeDtoEntrance = objectMapper.readValue(themeJson, ThemeDtoEntrance.class);

        // 2. Validar archivos subidos
        List<String> fileErrors = FileValidatorUtils.validateImages(files);

        // 3. Validar DTO manualmente (porque viene como JSON string)
        Set<ConstraintViolation<ThemeDtoEntrance>> violations = validator.validate(themeDtoEntrance);
        List<String> dtoErrors = violations.stream()
                .map(v ->
                        v.getPropertyPath() + ": " + v.getMessage())
                .toList();

        // 4. Unificar errores
        List<String> allErrors = new ArrayList<>();
        allErrors.addAll(fileErrors);
        allErrors.addAll(dtoErrors);

        if (!allErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<ThemeDtoExit>builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Errores de validación")
                    .error(allErrors)
                    .result(null)
                    .build());
        }

        // 5. Crear temática
        ThemeDtoExit createdTheme = themeService.createTheme(files, themeDtoEntrance);

        // 6. Devolver respuesta exitosa
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<ThemeDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Temática creada exitosamente.")
                        .error(null)
                        .result(createdTheme)
                        .build());
    }


    // 🔹 OBTENER TODAS LAS TEMÁTICAS
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<ThemeDtoExit>>> allTheme(Pageable pageable) {

        Page<ThemeDtoExit> themeDtoExits = themeService.getAllThemes(pageable);
        return ResponseEntity.ok(ApiResponse.<Page<ThemeDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de temáticas obtenida exitosamente.")
                .error(null)
                .result(themeDtoExits)
                .build());
    }

    // 🔹 BUSCAR TEMÁTICA POR ID
    @GetMapping("{idTheme}")
    public ResponseEntity<ApiResponse<ThemeDtoExit>> searchThemeById(@PathVariable UUID idTheme) throws ResourceNotFoundException {

        ThemeDtoExit foundTheme = themeService.getThemeById(idTheme);
        return ResponseEntity.ok(ApiResponse.<ThemeDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Temática encontrada con éxito.")
                .error(null)
                .result(foundTheme)
                .build());

    }

    // 🔹 ACTUALIZAR TEMÁTICA
    @PutMapping()
    public ResponseEntity<ApiResponse<?>> updateTheme(@RequestBody @Valid ThemeDtoModify themeDtoModify) throws ResourceNotFoundException {

        ThemeDtoExit updatedTheme = themeService.updateTheme(themeDtoModify);
        return ResponseEntity.ok(ApiResponse.<ThemeDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Temática actualizada con éxito.")
                .error(null)
                .result(updatedTheme)
                .build());

    }

    // 🔹 ELIMINAR TEMÁTICA
    @DeleteMapping("{idTheme}")
    public ResponseEntity<ApiResponse<Void>> deleteTheme(@PathVariable UUID idTheme) throws ResourceNotFoundException {

        themeService.deleteTheme(idTheme);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Temática con ID " + idTheme + " eliminada exitosamente.")
                .error(null)
                .result(null)
                .build());


    }

    // 🔹 BUSCAR TEMÁTICA POR NOMBRE
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<ThemeDtoExit>>> searchThemeByName(
            @RequestParam String name,
            Pageable pageable) {


        Page<ThemeDtoExit> themeDtoExitshme = themeService.searchTheme(name, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<ThemeDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda de tematicas exitosa.")
                .error(null)
                .result(themeDtoExitshme)
                .build());


    }
}
