package com.musichouse.api.music.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoAddInstrument;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.imageUrlInstrument.ImageUrlsInstrumentService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Validator;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final ImageUrlsInstrumentService imageUrlsService;
    private final ObjectMapper objectMapper;
    private Validator validator;

    // 🔹 AGREGAR IMAGENES
    @PostMapping()
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> createImageUrls(
            @RequestPart("files") List<MultipartFile> files,
            @RequestPart("data") String jsonData
    ) throws ResourceNotFoundException, JsonProcessingException {


        ImageUrlsDtoAddInstrument imageUrlsDtoEntrance = objectMapper.readValue(jsonData, ImageUrlsDtoAddInstrument.class);

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
    @GetMapping()
    public ResponseEntity<ApiResponse<Page<ImagesUrlsDtoExit>>> getAllImageUrls(Pageable pageable) {

        Page<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsService.getAllImageUrls(pageable);

        return ResponseEntity.ok(ApiResponse.<Page<ImagesUrlsDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de imágenes obtenida con éxito.")
                .error(null)
                .result(imagesUrlsDtoExits)
                .build());
    }


    // 🔹 ELIMINAR IMAGEN
    @DeleteMapping("/{idInstrument}/{idImage}")
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

    @GetMapping("/{instrumentId}")
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> getImageUrlsByInstrumentId(@PathVariable UUID instrumentId)
            throws ResourceNotFoundException {

        List<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsService.getImageUrlsByInstrumentId(instrumentId);


        return ResponseEntity.ok(ApiResponse.<List<ImagesUrlsDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Imagenes encontrados con éxito para el instrument con ID: " + instrumentId)
                .error(null)
                .result(imagesUrlsDtoExits)
                .build());
    }


}
