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
                            .error(null)
                            .result(themeDtoExit)
                            .build());
        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("La temática ya existe en la base de datos.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la solicitud.")
                            .error(e.getMessage())
                            .result(null)
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
                .error(null)
                .result(themeDtoExits)
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
                    .error(null)
                    .result(foundTheme)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<ThemeDtoExit>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró la temática con el ID proporcionado.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 ACTUALIZAR TEMÁTICA
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateTheme(@RequestBody @Valid ThemeDtoModify themeDtoModify) {


        try {
            ThemeDtoExit updatedTheme = themeService.updateTheme(themeDtoModify);
            return ResponseEntity.ok(ApiResponse.<ThemeDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temática actualizada con éxito.")
                    .error(null)
                    .result(updatedTheme)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UUID>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró la temática con el ID proporcionado.")
                            .error(e.getMessage())
                            .result(themeDtoModify.getIdTheme())
                            .build());
        }catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("La temática ya existe en la base de datos.")
                            .error(e.getMessage())
                            .result(themeDtoModify.getThemeName())
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
                    .error(null)
                    .result(null)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<Void>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("La temática con el ID " + idTheme + " no se encontró.")
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

    // 🔹 BUSCAR TEMÁTICA POR NOMBRE
    @GetMapping("/find/nameTheme/{themeName}")
    public ResponseEntity<ApiResponse<List<Theme>>> searchTheme(@PathVariable String themeName) {
        try {
            if (themeName == null || themeName.trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre de la temática no puede estar vacío.");
            }

            List<Theme> themes = themeService.searchTheme(themeName);
            if (themes.isEmpty()) {

                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<List<Theme>>builder()
                                .status(HttpStatus.NOT_FOUND)
                                .statusCode(HttpStatus.NOT_FOUND.value())
                                .message("No se encontraron temáticas con el nombre: " + themeName)
                                .error(null)
                                .result(null)
                                .build());
            }

            return ResponseEntity.ok(ApiResponse.<List<Theme>>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Temáticas encontradas con éxito.")
                    .error(null)
                    .result(themes)
                    .build());

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.<List<Theme>>builder()
                            .status(HttpStatus.BAD_REQUEST)
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .message("Parámetro de búsqueda inválido: " + themeName)
                            .error(e.getMessage())
                            .result(null)
                            .build());
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.<List<Theme>>builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .message("Ocurrió un error al procesar la búsqueda.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }
}
