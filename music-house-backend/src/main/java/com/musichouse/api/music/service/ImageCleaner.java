package com.musichouse.api.music.service;

import com.musichouse.api.music.entity.ImageUrlsInstrument;
import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class ImageCleaner {

    private final S3FileDeleter s3FileDeleter;

    /**
     * Elimina una imagen de S3 a partir de su URL completa.
     *
     * @param imageUrl URL pública de la imagen en S3.
     */
    public void deleteImageFromS3(String imageUrl) {
        if (imageUrl != null && !imageUrl.isEmpty()) {
            String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
            s3FileDeleter.deleteFileFromS3(key);
        }
    }


    /**
     * Elimina múltiples imágenes de S3 a partir de sus URLs.
     *
     * @param imageUrls Lista de URLs públicas de las imágenes en S3.
     */
    public void deleteAllImagesFromS3(List<String> imageUrls) {
        if (imageUrls != null) {
            imageUrls.forEach(this::deleteImageFromS3);
        }
    }

    /**
     * Extrae las URLs de imágenes de una lista de ImageUrlsInstrument.
     *
     * @param images Lista de ImageUrlsInstrument.
     * @return Lista de URLs de imágenes.
     */
    public List<String> extractImageUrls(List<ImageUrlsInstrument> images) {
        if (images == null) {
            return List.of();
        }
        return images.stream()
                .map(ImageUrlsInstrument::getImageUrl)
                .collect(Collectors.toList());
    }

}