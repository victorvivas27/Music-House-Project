package com.musichouse.api.music.service.awss3Service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class S3UploadHelper {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public S3UploadHelper(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }

    public String uploadSingleFile(MultipartFile file, String folder) {
        try {
            String newFilename = folder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException(
                    "Error al cargar el archivo a S3", e);
        }
    }

    public List<String> uploadMultipleFiles(List<MultipartFile> files, String folder) {
        List<String> imageUrls = new ArrayList<>();
        if (files == null || files.isEmpty()) return imageUrls;

        for (MultipartFile file : files) {
            imageUrls.add(uploadSingleFile(file, folder));
        }

        return imageUrls;
    }
}
