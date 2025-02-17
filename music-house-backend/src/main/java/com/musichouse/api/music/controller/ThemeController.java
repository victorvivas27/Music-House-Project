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
    private final ThemeService themeService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<ThemeDtoExit>> createTheme(@RequestBody @Valid ThemeDtoEntrance themeDtoEntrance) {
        try {
            ThemeDtoExit themeDtoExit = themeService.createTheme(themeDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Tematica creada exitosamente.", themeDtoExit));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("La tematica ya existe en la base de datos.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ThemeDtoExit>>> allTheme() {
        List<ThemeDtoExit> themeDtoExits = themeService.getAllThemes();
        ApiResponse<List<ThemeDtoExit>> response =
                new ApiResponse<>("Lista de Tematica exitosa.", themeDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idTheme}")
    public ResponseEntity<?> searchThemeById(@PathVariable UUID idTheme) {
        try {
            ThemeDtoExit foundTheme = themeService.getThemeById(idTheme);
            return ResponseEntity.ok(new ApiResponse<>("Tematica encontrada.", foundTheme));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la tematica con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTheme(@RequestBody @Valid ThemeDtoModify themeDtoModify) {
        try {
            ThemeDtoExit themeDtoExit = themeService.updateTheme(themeDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Tematica  actualizada con éxito.", themeDtoModify));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la tematica con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idTheme}")
    public ResponseEntity<?> deleteTheme(@PathVariable UUID idTheme) {
        try {
            themeService.deleteTheme(idTheme);
            return ResponseEntity.ok(new ApiResponse<>("Tematica con ID " + idTheme + " eliminada exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("La tematica con el ID " + idTheme + " no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/find/nameTheme/{themeName}")
    public ResponseEntity<?> searchTheme(
            @PathVariable String themeName) {
        try {
            List<Theme> themes = themeService.searchTheme(themeName);
            if (themes.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>("No se encontraron las tematicas con el nombre proporcionado.", null));
            }
            return ResponseEntity.ok(themes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Parámetro de búsqueda inválido.", null));
        }
    }
}
