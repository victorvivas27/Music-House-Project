package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.FavoriteDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.favorite.FavoriteService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/favorites")
public class FavoriteController {

    private static final Logger LOGGER = LoggerFactory.getLogger(FavoriteController.class);
    private final FavoriteService favoriteService;

    // 🔹 AGREGAR FAVORITO
    @PostMapping()
    public ResponseEntity<ApiResponse<FavoriteDtoExit>> addFavorite(@RequestBody @Valid FavoriteDtoEntrance favoriteDtoEntrance) throws ResourceNotFoundException {
        FavoriteDtoExit favoriteDtoExit = favoriteService.addFavorite(favoriteDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<FavoriteDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Instrumento agregado a favoritos con éxito.")
                        .error(null)
                        .result(favoriteDtoExit)
                        .build());
    }


    // 🔹 BUSCAR FAVORITOS POR ID DE USUARIO
    @GetMapping("{idUser}")
    public ResponseEntity<ApiResponse<Page<FavoriteDtoExit>>> getFavoritesByUserId(@PathVariable UUID idUser, Pageable pageable) {

        Page<FavoriteDtoExit> favoriteDtoExits = favoriteService.getFavoritesByUserId(idUser, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<FavoriteDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Favoritos del Usuario")
                .error(null)
                .result(favoriteDtoExits)
                .build());
    }


}