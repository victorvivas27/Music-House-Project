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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(FavoriteController.class);
    private final FavoriteService favoriteService;

    // 🔹 AGREGAR FAVORITO
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<FavoriteDtoExit>> addFavorite(@RequestBody @Valid FavoriteDtoEntrance favoriteDtoEntrance) throws ResourceNotFoundException {
        FavoriteDtoExit favoriteDtoExit = favoriteService.addFavorite(favoriteDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FavoriteDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Instrumento agregado a favoritos con éxito.")
                        .data(favoriteDtoExit)
                        .error(null)
                        .build());
    }

    // 🔹 OBTENER TODOS LOS FAVORITOS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<FavoriteDtoExit>>> getAllFavorites() {
        List<FavoriteDtoExit> favoriteDtoExits = favoriteService.getAllFavorite();

        return ResponseEntity.ok(ApiResponse.<List<FavoriteDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de favoritos obtenida con éxito.")
                .data(favoriteDtoExits)
                .error(null)
                .build());
    }

    // 🔹 BUSCAR FAVORITOS POR ID DE USUARIO
    @GetMapping("/search/{userId}")
    public ResponseEntity<ApiResponse<List<FavoriteDtoExit>>> getFavoritesByUserId(@PathVariable UUID userId) throws ResourceNotFoundException {
        List<FavoriteDtoExit> favoriteDtoExits = favoriteService.getFavoritesByUserId(userId);

        return ResponseEntity.ok(ApiResponse.<List<FavoriteDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Favoritos encontrados con éxito para el usuario con ID: " + userId)
                .data(favoriteDtoExits)
                .error(null)
                .build());
    }

    // 🔹 ELIMINAR FAVORITO
    @DeleteMapping("/delete/{idInstrument}/{idUser}/{idFavorite}")
    public ResponseEntity<ApiResponse<IsFavoriteExit>> deleteFavorite(
            @PathVariable UUID idInstrument, @PathVariable UUID idUser, @PathVariable UUID idFavorite) throws ResourceNotFoundException {
        ApiResponse<IsFavoriteExit> response = favoriteService.deleteFavorite(idInstrument, idUser, idFavorite);

        return ResponseEntity.ok(ApiResponse.<IsFavoriteExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Instrumento eliminado de favoritos con éxito.")
                .data(response.getData())
                .error(null)
                .build());
    }
}