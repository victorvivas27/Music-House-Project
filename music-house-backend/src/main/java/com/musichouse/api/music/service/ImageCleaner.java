package com.musichouse.api.music.service;

import com.musichouse.api.music.entity.ImageUrls;
import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class ImageCleaner {

    private final S3FileDeleter s3FileDeleter;

    /**
     * Elimina de S3 todas las imágenes correspondientes a las URLs asociadas.
     *
     * @param imageUrls Lista de entidades {@link ImageUrls} que contienen las URLs a eliminar.
     */
    public void deleteImagesFromS3(List<ImageUrls> imageUrls) {
        for (ImageUrls imageUrl : imageUrls) {
            String url = imageUrl.getImageUrl();

            if (url != null && !url.isEmpty()) {
                String key = S3UrlParser.extractKeyFromS3Url(url);
                s3FileDeleter.deleteFileFromS3(key);
            }
        }
    }
}