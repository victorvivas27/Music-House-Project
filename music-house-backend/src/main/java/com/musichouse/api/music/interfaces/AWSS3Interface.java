package com.musichouse.api.music.interfaces;

import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

public interface AWSS3Interface {
    String uploadFileToS3User(MultipartFile file, UUID idUser);


    List<String> uploadFilesToS3Instrument(List<MultipartFile> files, UUID idInstrument);

    List<String> getObjectFromS3();

    InputStream downloadFile(String key);

    void deleteFileFromS3(String key);
}
