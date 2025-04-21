package com.musichouse.api.music.interfaces;


import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoAddInstrument;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ImageUrlsInstrumentInterface {

    List<ImagesUrlsDtoExit> addImageUrls(List<MultipartFile> files, ImageUrlsDtoAddInstrument imageUrlsDtoEntrance) throws ResourceNotFoundException;

    Page<ImagesUrlsDtoExit> getAllImageUrls(Pageable pageable);

    void deleteImageUrls(UUID idImage, UUID idInstrument) throws ResourceNotFoundException;

    List<ImagesUrlsDtoExit> getImageUrlsByInstrumentId(UUID instrumentId) throws ResourceNotFoundException;


}
