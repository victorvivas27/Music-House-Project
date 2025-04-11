package com.musichouse.api.music.interfaces;


import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoAddInstrument;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ImageUrlsInterface {

    List<ImagesUrlsDtoExit> addImageUrls(List<MultipartFile> files, ImageUrlsDtoAddInstrument imageUrlsDtoEntrance) throws ResourceNotFoundException;

    List<ImagesUrlsDtoExit> getAllImageUrls();

    ImagesUrlsDtoExit getImageUrlsById(UUID idImage) throws ResourceNotFoundException;

    /**
     * Reemplaza la imagen asociada a un tema, usando el ID de la imagen.
     *
     * @param imageUrlsDtoModify DTO que contiene el ID de la imagen a modificar.
     * @return DTO con la información actualizada de la imagen.
     * @throws ResourceNotFoundException si no se encuentra la imagen por el ID.
     */
    // ImagesUrlsDtoExit updateImageUrls(ImageUrlsDtoModify imageUrlsDtoModify, MultipartFile newImage)
    // throws ResourceNotFoundException;

    void deleteImageUrls(UUID idImage, UUID idInstrument) throws ResourceNotFoundException;

    List<ImagesUrlsDtoExit> getImageUrlsByInstrumentId(UUID instrumentId) throws ResourceNotFoundException;

    //List<ImagesUrlsDtoExit> addImagesToTheme(ThemeDtoAddImage themeDtoAddImage, List<MultipartFile> images)
    // throws ResourceNotFoundException;


}
