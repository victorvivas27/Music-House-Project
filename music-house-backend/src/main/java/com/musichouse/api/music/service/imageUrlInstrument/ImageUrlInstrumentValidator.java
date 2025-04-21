package com.musichouse.api.music.service.imageUrlInstrument;

import com.musichouse.api.music.entity.ImageUrlsInstrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.ImageUrlsIntrumentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class ImageUrlInstrumentValidator {
    private final ImageUrlsIntrumentRepository imageUrlsIntrumentRepository;

    public ImageUrlsInstrument validateImageByIdAndInstrumentId(UUID idInstrument, UUID idImage)
            throws ResourceNotFoundException {

        return imageUrlsIntrumentRepository.findById(idImage)
                .filter(img -> img.getInstrument().getIdInstrument().equals(idInstrument))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Imagen no encontrada o no pertenece al instrumento con ID " + idInstrument
                ));
    }

}
