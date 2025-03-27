package com.musichouse.api.music.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserAdminDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.FileNotFoundException;
import com.musichouse.api.music.interfaces.AWSS3Interface;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AWSS3Service implements AWSS3Interface {
    private static final Logger LOGGER = LoggerFactory.getLogger(AWSS3Service.class);

    private final AmazonS3 amazonS3;


    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    public AWSS3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }


    public String uploadFileToS3User(MultipartFile file, UUID idUser) {
        try {
            String userFolder = "usuarios/" + idUser;
            String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Error al cargar el archivo a S3", e);
        }
    }

    public List<String> uploadFilesToS3Instrument(List<MultipartFile> files, UUID idInstrument) {
        List<String> imageUrls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return imageUrls;
        }

        for (MultipartFile file : files) {
            try {

                String instrumentFolder = "instruments/"+idInstrument;


                String newFilename = instrumentFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(file.getSize());
                metadata.setContentType(file.getContentType());


                amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));


                String imageUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;

                imageUrls.add(imageUrl);

            } catch (IOException e) {

                throw new RuntimeException("Error al cargar el archivo a S3", e);
            }
        }

        return imageUrls;
    }





    public String uploadUserModifyFileToS3(MultipartFile file, UserDtoModify userDtoModify) {
        try {
            String userFolder = "usuarios/" + userDtoModify.getIdUser();

            String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;

        } catch (IOException e) {

            throw new RuntimeException("Error al cargar el archivo a S3", e);
        }
    }


    @Override
    public List<String> getObjectFromS3() {
        ListObjectsV2Result result = amazonS3.listObjectsV2(bucketName);
        List<S3ObjectSummary> objects = result.getObjectSummaries();
        List<String> list = objects.stream().map(items -> {
            return items.getKey();
        }).toList();
        return list;
    }


    @Override
    public InputStream downloadFile(String key) {
        if (!doesObjectExist(key)) {
            throw new FileNotFoundException("File " + key + " does not exist");
        }
        S3Object object = amazonS3.getObject(bucketName, key);
        return object.getObjectContent();
    }

    @Override
    public void deleteFileFromS3(String key) {
        try {
            if (!doesObjectExist(key)) {
                throw new FileNotFoundException("El archivo con clave " + key + " no existe en S3.");
            }

            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));

        } catch (AmazonS3Exception e) {

            throw new RuntimeException("No se pudo eliminar el archivo de S3", e);
        }
    }


    public boolean doesObjectExist(String key) {
        try {
            return amazonS3.doesObjectExist(bucketName, key);
        } catch (AmazonS3Exception e) {

            return false;
        } catch (Exception e) {
            return false;
        }
    }
}


