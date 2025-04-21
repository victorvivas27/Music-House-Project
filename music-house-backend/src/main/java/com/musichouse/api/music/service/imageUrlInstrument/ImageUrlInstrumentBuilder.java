package com.musichouse.api.music.service.imageUrlInstrument;

import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.entity.ImageUrlsInstrument;
import com.musichouse.api.music.entity.Instrument;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class ImageUrlInstrumentBuilder {

    public List<ImageUrlsInstrument> buildImageUrlsInstrumentList(Instrument instrument, List<String> imageUrls) {
        return (List<ImageUrlsInstrument>) imageUrls.stream()
                .map(url -> ImageUrlsInstrument.builder()
                        .imageUrl(url)
                        .instrument(instrument)
                        .build())
                .toList();
    }

    public List<ImagesUrlsDtoExit> buildList(List<ImageUrlsInstrument> images, UUID idInstrument) {
        return images.stream()
                .map(image -> ImagesUrlsDtoExit.builder()
                        .idImage(image.getIdImage())
                        .idInstrument(idInstrument)
                        .imageUrl(image.getImageUrl())
                        .build())
                .toList();
    }
}


