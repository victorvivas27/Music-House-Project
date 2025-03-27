package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.dto.dto_modify.ImageUrlsDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ImageUrlsService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/imageurls")
public class ImageUrlsController {

    private static final Logger LOGGER = LoggerFactory.getLogger(ImageUrlsController.class);
    private final ImageUrlsService imageUrlsService;
    private final ObjectMapper objectMapper;

    // 🔹 AGREGAR IMAGENES
    @PostMapping("/add_image")
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> createImageUrls(
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("data") String jsonData
    ) throws ResourceNotFoundException, JsonProcessingException {

        // Parseás vos con ObjectMapper
        ImageUrlsDtoEntrance imageUrlsDtoEntrance = objectMapper.readValue(jsonData, ImageUrlsDtoEntrance.class);

        List<ImagesUrlsDtoExit> result = imageUrlsService.addImageUrls(files, imageUrlsDtoEntrance);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<List<ImagesUrlsDtoExit>>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Imágenes agregadas exitosamente.")
                        .error(null)
                        .result(result)
                        .build());
    }

    // 🔹 OBTENER TODAS LAS IMAGENES
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> getAllImageUrls() {
        List<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsService.getAllImageUrls();

        return ResponseEntity.ok(ApiResponse.<List<ImagesUrlsDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de imágenes obtenida con éxito.")
                .error(null)
                .result(imagesUrlsDtoExits)
                .build());
    }

    // 🔹 BUSCAR IMAGEN POR ID
    @GetMapping("/search/{idImage}")
    public ResponseEntity<ApiResponse<ImagesUrlsDtoExit>> searchImageUrlsById(@PathVariable UUID idImage) throws ResourceNotFoundException {
        ImagesUrlsDtoExit imagesUrlsDtoExit = imageUrlsService.getImageUrlsById(idImage);

        return ResponseEntity.ok(ApiResponse.<ImagesUrlsDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Imagen encontrada con éxito.")
                .error(null)
                .result(imagesUrlsDtoExit)
                .build());
    }

    // 🔹 ACTUALIZAR IMAGENES
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<ImagesUrlsDtoExit>> updateImageUrls(@RequestBody @Valid ImageUrlsDtoModify imageUrlsDtoModify) throws ResourceNotFoundException {
        ImagesUrlsDtoExit imagesUrlsDtoExit = imageUrlsService.updateImageUrls(imageUrlsDtoModify);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.<ImagesUrlsDtoExit>builder()
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .message("Imagen actualizada con éxito.")
                        .error(null)
                        .result(imagesUrlsDtoExit)
                        .build());
    }

    // 🔹 ELIMINAR IMAGEN
    @DeleteMapping("/delete/{idInstrument}/image-id/{idImage}")
    public ResponseEntity<ApiResponse<Void>> deleteImageUrls(
            @PathVariable UUID idInstrument,
            @PathVariable UUID idImage)
            throws ResourceNotFoundException {

        imageUrlsService.deleteImageUrls(idInstrument, idImage);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Imagen eliminada exitosamente.")
                .error(null)
                .result(null)
                .build());
    }

    @GetMapping("/by-instrument/{instrumentId}")
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> getImageUrlsByInstrumentId(@PathVariable UUID instrumentId) {
        List<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsService.getImageUrlsByInstrumentId(instrumentId);

        String message = imagesUrlsDtoExits.isEmpty()
                ? "No se encontraron imagenes para el instrumento con ID: " + instrumentId
                : "Imagenes encontrados con éxito para el instrument con ID: " + instrumentId;

        return ResponseEntity.ok(ApiResponse.<List<ImagesUrlsDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message(message)
                .error(null)
                .result(imagesUrlsDtoExits)
                .build());
    }
}
