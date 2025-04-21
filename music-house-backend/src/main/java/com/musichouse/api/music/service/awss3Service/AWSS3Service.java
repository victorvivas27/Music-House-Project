package com.musichouse.api.music.service.awss3Service;

import com.amazonaws.services.s3.AmazonS3;
import com.musichouse.api.music.dto.dto_modify.UserDtoModify;
import com.musichouse.api.music.interfaces.AWSS3Interface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class AWSS3Service implements AWSS3Interface {
    private static final Logger LOGGER = LoggerFactory.getLogger(AWSS3Service.class);

    private final AmazonS3 amazonS3;
    private final S3UploadHelper s3UploadHelper;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;


    public String copyDefaultUserImage(UUID idUser) {
        String sourceKey = "usuarios/default/default.png";
        String destinationKey = "usuarios/" + idUser + "/default.png";

        amazonS3.copyObject(bucketName, sourceKey, bucketName, destinationKey);

        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + destinationKey;
    }

    public AWSS3Service(AmazonS3 amazonS3, S3UploadHelper s3UploadHelper) {
        this.amazonS3 = amazonS3;
        this.s3UploadHelper = s3UploadHelper;
    }

    public String uploadFileToS3User(MultipartFile file, UUID idUser) {
        return s3UploadHelper.uploadSingleFile(file, "usuarios/" + idUser);
    }

    public String uploadUserModifyFileToS3(MultipartFile file, UserDtoModify userDtoModify) {
        return s3UploadHelper.uploadSingleFile(file, "usuarios/" + userDtoModify.getIdUser());
    }

    public List<String> uploadFilesToS3Instrument(List<MultipartFile> files, UUID idInstrument) {
        return s3UploadHelper.uploadMultipleFiles(files, "instruments/" + idInstrument);
    }

    public String uploadToS3Theme(MultipartFile file, UUID idTheme) {
        return s3UploadHelper.uploadSingleFile(file, "theme/" + idTheme);
    }

    public String uploadSingleFile(MultipartFile file, String folder) {
        return s3UploadHelper.uploadSingleFile(file, folder);
    }

}


