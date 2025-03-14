package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserAdminDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface AWSS3Interface {
    String uploadFileToS3(MultipartFile file, UserDtoEntrance userDtoEntrance);
    String uploadFileToS3Admin(MultipartFile file, UserAdminDtoEntrance userAdminDtoEntrance);

     List<String> uploadFilesToS3Instrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance);

    List<String> getObjectFromS3();

    InputStream downloadFile(String key);

    void deleteFileFromS3(String key);
}
