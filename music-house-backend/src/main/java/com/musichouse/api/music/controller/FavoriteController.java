package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.FavoriteDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.dto.dto_exit.IsFavoriteExit;
import com.musichouse.api.music.exception.FavoriteAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.FavoriteService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/favorite")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<?>> addAvailableDate(@RequestBody @Valid FavoriteDtoEntrance favoriteDtoEntrance) {
        try {
            FavoriteDtoExit favoriteDtoExit = favoriteService.addFavorite(favoriteDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Instrumento Agregado a favoritos exitosamente.", favoriteDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (FavoriteAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FavoriteDtoExit>>> getAllFavorite() {
        List<FavoriteDtoExit> favoriteDtoExits = favoriteService.getAllFavorite();
        ApiResponse<List<FavoriteDtoExit>> response =
                new ApiResponse<>("Lista de Favoritos disponibles exitosa.", favoriteDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{userId}")
    public ResponseEntity<?> searchFavoritesByUserId(@PathVariable UUID userId) {
        try {
            List<FavoriteDtoExit> favoriteDtoExits = favoriteService.getFavoritesByUserId(userId);
            return ResponseEntity.ok(new ApiResponse<>("Favoritos encontrados con éxito para el usuario con ID: " + userId, favoriteDtoExits));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontraron favoritos para el usuario con id: " + userId, null));
        }
    }

    @DeleteMapping("/delete/{idInstrument}/{idUser}/{idFavorite}")
    public ResponseEntity<ApiResponse<IsFavoriteExit>> deleteAvailableDate(
            @PathVariable UUID idInstrument, @PathVariable UUID idUser, @PathVariable UUID idFavorite) {
        try {
            ApiResponse<IsFavoriteExit> response = favoriteService.deleteFavorite(idInstrument, idUser, idFavorite);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
