package com.musichouse.api.music.service;

import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

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
}