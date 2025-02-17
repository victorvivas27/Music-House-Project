package com.musichouse.api.music.interfaces;


import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.dto.dto_modify.ImageUrlsDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

public interface ImageUrlsInterface {

    ImagesUrlsDtoExit addImageUrls(ImageUrlsDtoEntrance imageUrlsDtoEntrance) throws ResourceNotFoundException;

    List<ImagesUrlsDtoExit> getAllImageUrls();

    ImagesUrlsDtoExit getImageUrlsById(UUID idImage) throws ResourceNotFoundException;

    ImagesUrlsDtoExit updateImageUrls(ImageUrlsDtoModify imageUrlsDtoModify) throws ResourceNotFoundException;

    void deleteImageUrls(UUID idImage, UUID idInstrument) throws ResourceNotFoundException;

}
