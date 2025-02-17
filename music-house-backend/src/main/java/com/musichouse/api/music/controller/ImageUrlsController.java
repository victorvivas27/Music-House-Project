package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.dto.dto_modify.ImageUrlsDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.ImageUrlsService;
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
@RequestMapping("/api/imageurls")
public class ImageUrlsController {

    private final ImageUrlsService imageUrlsService;

    @PostMapping("/add_image")
    public ResponseEntity<ApiResponse<?>> createImageUrls(@RequestBody @Valid ImageUrlsDtoEntrance imageUrlsDtoEntrance) {
        try {
            ImagesUrlsDtoExit imagesUrlsDtoExit = imageUrlsService.addImageUrls(imageUrlsDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Imágenes agregadas exitosamente.", imagesUrlsDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontro  el instrumento con el ID proporcionado.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ImagesUrlsDtoExit>>> allImagesUrls() {
        List<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsService.getAllImageUrls();
        ApiResponse<List<ImagesUrlsDtoExit>> response =
                new ApiResponse<>("Lista de Imagenes Urls exitosa.", imagesUrlsDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idImage}")
    public ResponseEntity<?> searchImageUrlsById(@PathVariable UUID idImage) {
        try {
            ImagesUrlsDtoExit imagesUrlsDtoExit = imageUrlsService.getImageUrlsById(idImage);
            return ResponseEntity.ok(new ApiResponse<>("Imagen Urls encontrada con exito.", imagesUrlsDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontro la imagen Urls con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateImageUrls(@RequestBody @Valid ImageUrlsDtoModify imageUrlsDtoModify) {
        try {
            ImagesUrlsDtoExit imagesUrlsDtoExit = imageUrlsService.updateImageUrls(imageUrlsDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Imagen Urls actualizada con exito.", imagesUrlsDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontro la imagen Urls con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idInstrument}/{idImage}")
    public ResponseEntity<ApiResponse<String>> deleteImageUrls(@PathVariable UUID idInstrument, @PathVariable UUID idImage) {
        try {
            imageUrlsService.deleteImageUrls(idInstrument, idImage);
            return ResponseEntity.ok(new ApiResponse<>("Urls de imagen eliminadas exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }
}
