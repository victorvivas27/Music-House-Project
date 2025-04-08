package com.musichouse.api.music.service.themeService;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.entity.ImageUrls;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Component
@AllArgsConstructor
public class ThemeBuilder {
    private final ModelMapper mapper;
    private final AWSS3Service awss3Service;

    public Theme buildThemeWithImages(ThemeDtoEntrance themeDtoEntrance, List<MultipartFile> files) {

        Theme theme = mapper.map(themeDtoEntrance, Theme.class);

        UUID generatedId = UUID.randomUUID();

        theme.setIdTheme(generatedId);


        List<String> imageUrls = awss3Service.uploadFilesToS3Theme(files, generatedId);

        List<ImageUrls> imageUrlEntities = imageUrls.stream().map(url -> {
            ImageUrls imageUrlEntity = new ImageUrls();
            imageUrlEntity.setImageUrl(url);
            imageUrlEntity.setTheme(theme);
            return imageUrlEntity;
        }).toList();

        theme.setImageUrls(imageUrlEntities);

        return theme;
    }

}
