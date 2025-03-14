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


    @Override
    public String uploadFileToS3(MultipartFile file,UserDtoEntrance userDtoEntrance) {
        try {
            // Crear el path del usuario en S3
            String userFolder = userDtoEntrance.getName().toLowerCase() + "-" + userDtoEntrance.getLastName().toLowerCase();
            String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Subir archivo a S3 con la estructura de path: {bucket}/usuarios/{nombre}/{archivo}
            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            // Retornar la URL correcta con el path del usuario
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;
        } catch (IOException e) {
            LOGGER.error("Error al cargar el archivo a S3", e);
            throw new RuntimeException("Error al cargar el archivo a S3", e);
        }
    }

    public List<String> uploadFilesToS3Instrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance) {
        List<String> imageUrls = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            return imageUrls; // Si no hay archivos, devolver una lista vacía
        }

        for (MultipartFile file : files) {
            try {
                // Crear el path en S3
                String userFolder = instrumentDtoEntrance.getName().toLowerCase();
                String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(file.getSize());
                metadata.setContentType(file.getContentType());

                // Subir archivo a S3
                amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

                // Agregar la URL generada a la lista
                String imageUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;
                imageUrls.add(imageUrl);
            } catch (IOException e) {
                LOGGER.error("Error al cargar el archivo a S3", e);
                throw new RuntimeException("Error al cargar el archivo a S3", e);
            }
        }

        return imageUrls; // ✅ Retornar la lista de URLs generadas
    }

    @Override
    public String uploadFileToS3Admin(MultipartFile file, UserAdminDtoEntrance userAdminDtoEntrance) {
        try {
            // Crear el path del usuario en S3
            String userFolder = userAdminDtoEntrance.getName().toLowerCase() + "-" + userAdminDtoEntrance.getLastName().toLowerCase();
            String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Subir archivo a S3 con la estructura de path: {bucket}/usuarios/{nombre}/{archivo}
            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            // Retornar la URL correcta con el path del usuario
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;
        } catch (IOException e) {
            LOGGER.error("Error al cargar el archivo a S3", e);
            throw new RuntimeException("Error al cargar el archivo a S3", e);
        }
    }

   

    public String uploadUserModifyFileToS3(MultipartFile file, UserDtoModify userDtoModify) {
        try {
            // Crear el path del usuario en S3
            String userFolder = userDtoModify.getName().toLowerCase() + "-" + userDtoModify.getLastName().toLowerCase();
            String newFilename = userFolder + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());

            // Subir archivo a S3 con la estructura de path: {bucket}/usuarios/{nombre}/{archivo}
            amazonS3.putObject(new PutObjectRequest(bucketName, newFilename, file.getInputStream(), metadata));

            // Retornar la URL correcta con el path del usuario
            return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + newFilename;
        } catch (IOException e) {
            LOGGER.error("Error al cargar el archivo a S3", e);
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
            LOGGER.info("Archivo eliminado de S3: {}", key);
        } catch (AmazonS3Exception e) {
            LOGGER.error("Error al eliminar el archivo de S3: {}", key, e);
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


