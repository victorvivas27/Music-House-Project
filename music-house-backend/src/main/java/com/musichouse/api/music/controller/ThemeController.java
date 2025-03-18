package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ThemeService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/theme")
public class ThemeController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ThemeController.class);
    private final ThemeService themeService;

    // 🔹 CREAR TEMÁTICA
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ThemeDtoExit>> createTheme(@RequestBody @Valid ThemeDtoEntrance themeDtoEntrance) {
        try {
            ThemeDtoExit themeDtoExit = themeService.createTheme(themeDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Temática creada exitosamente.")
                            .data(themeDtoExit)
                            .error(null)
                            .build());
        } catch (DataIntegrityViolationException e) {
            LOGGER.error("Error: Temática duplicada - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("La temática ya existe en la base de datos.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        } catch (Exception e) {
            LOGGER.error("Error inesperado en createTheme", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 OBTENER TODAS LAS TEMÁTICAS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ThemeDtoExit>>> allTheme() {
        List<ThemeDtoExit> themeDtoExits = themeService.getAllThemes();
        return ResponseEntity.ok(ApiResponse.<List<ThemeDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de temáticas obtenida exitosamente.")
                .data(themeDtoExits)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR TEMÁTICA POR ID
    @GetMapping("/search/{idTheme}")
    public ResponseEntity<ApiResponse<ThemeDtoExit>> searchThemeById(@PathVariable UUID idTheme) {
        try {
            ThemeDtoExit foundTheme = themeService.getThemeById(idTheme);
            return ResponseEntity.ok(ApiResponse.<ThemeDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temática encontrada con éxito.")
                    .data(foundTheme)
                    .error(null)
                    .build());
        } catch (ResourceNotFoundException e) {
            LOGGER.warn("Error: Temática no encontrada - ID: {}", idTheme);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró la temática con el ID proporcionado.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 ACTUALIZAR TEMÁTICA
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ThemeDtoExit>> updateTheme(@RequestBody @Valid ThemeDtoModify themeDtoModify) {
        try {
            ThemeDtoExit updatedTheme = themeService.updateTheme(themeDtoModify);
            return ResponseEntity.ok(ApiResponse.<ThemeDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temática actualizada con éxito.")
                    .data(updatedTheme)
                    .error(null)
                    .build());
        } catch (ResourceNotFoundException e) {
            LOGGER.warn("Error: Temática no encontrada - ID: {}", themeDtoModify.getIdTheme());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró la temática con el ID proporcionado.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 ELIMINAR TEMÁTICA
    @DeleteMapping("/delete/{idTheme}")
    public ResponseEntity<ApiResponse<Void>> deleteTheme(@PathVariable UUID idTheme) {
        try {
            themeService.deleteTheme(idTheme);
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temática con ID " + idTheme + " eliminada exitosamente.")
                    .data(null)
                    .error(null)
                    .build());
        } catch (ResourceNotFoundException e) {
            LOGGER.warn("Error: Temática no encontrada - ID: {}", idTheme);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("La temática con el ID " + idTheme + " no se encontró.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        } catch (Exception e) {
            LOGGER.error("Error inesperado en deleteTheme", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }

    // 🔹 BUSCAR TEMÁTICA POR NOMBRE
    @GetMapping("/find/nameTheme/{themeName}")
    public ResponseEntity<ApiResponse<List<Theme>>> searchTheme(@PathVariable String themeName) {
        try {
            if (themeName == null || themeName.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre de la temática no puede estar vacío.");
            }

            List<Theme> themes = themeService.searchTheme(themeName);
            if (themes.isEmpty()) {
                LOGGER.warn("Búsqueda sin resultados para la temática: {}", themeName);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<List<Theme>>builder()
                                .status(HttpStatus.NOT_FOUND)
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .message("No se encontraron temáticas con el nombre: " + themeName)
                                .data(null)
                                .error(null)
                                .build());
            }

            return ResponseEntity.ok(ApiResponse.<List<Theme>>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temáticas encontradas con éxito.")
                    .data(themes)
                    .error(null)
                    .build());

        } catch (IllegalArgumentException e) {
            LOGGER.error("Error en búsqueda de temática: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<List<Theme>>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("Parámetro de búsqueda inválido: " + themeName)
                            .data(null)
                            .error(e.getMessage())
                            .build());
        } catch (Exception e) {
            LOGGER.error("Error inesperado en searchTheme", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<Theme>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la búsqueda.")
                            .data(null)
                            .error(e.getMessage())
                            .build());
        }
    }
}
