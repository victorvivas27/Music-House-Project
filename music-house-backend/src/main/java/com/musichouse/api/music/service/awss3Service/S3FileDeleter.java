package com.musichouse.api.music.service.awss3Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.musichouse.api.music.exception.FileNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.InputStream;

@Component

public class S3FileDeleter {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3FileDeleter(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }


    public void deleteFileFromS3(String key) {
        try {
            if (!doesObjectExist(key)) {
                throw new FileNotFoundException(
                        "El archivo con clave " + key + " no existe en S3.");
            }

            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));

        } catch (AmazonS3Exception e) {
            throw new RuntimeException(
                    "No se pudo eliminar el archivo de S3", e);
        }
    }

    public boolean doesObjectExist(String key) {
        try {
            return amazonS3.doesObjectExist(bucketName, key);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public InputStream downloadFile(String key) {
        if (!doesObjectExist(key)) {
            throw new FileNotFoundException(
                    "El archivo con clave " + key + " no existe en S3.");
        }

        S3Object object = amazonS3.getObject(bucketName, key);
        return object.getObjectContent();
    }
}
