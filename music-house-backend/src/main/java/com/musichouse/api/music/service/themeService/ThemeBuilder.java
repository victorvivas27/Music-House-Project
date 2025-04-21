package com.musichouse.api.music.service.themeService;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
@AllArgsConstructor
public class ThemeBuilder {
    private final ModelMapper mapper;
    private final AWSS3Service awss3Service;
    private final ImageCleaner imageCleaner;

    public Theme buildThemeWithImage(ThemeDtoEntrance themeDtoEntrance, MultipartFile file) {
        // 1. Mapear DTO a entidad
        Theme theme = mapper.map(themeDtoEntrance, Theme.class);

        // 2. Generar ID único para el theme
        UUID generatedId = UUID.randomUUID();
        theme.setIdTheme(generatedId);

        // 3. Subir imagen a S3
        String imageUrl = awss3Service.uploadSingleFile(file, "theme/" + generatedId);

        // 4. Asignar la URL directamente al campo
        theme.setImageUrlTheme(imageUrl);

        return theme;
    }

    public Theme updateThemeImageIfPresent(Theme themeToUpdate, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            // 1. Eliminar imagen anterior
            imageCleaner.deleteImageFromS3(themeToUpdate.getImageUrlTheme());

            // 2. Subir nueva imagen
            String imageUrl = awss3Service.uploadSingleFile(file, "theme/" + themeToUpdate.getIdTheme());

            // 3. Actualizar URL
            themeToUpdate.setImageUrlTheme(imageUrl);
        }

        return themeToUpdate;
    }
}
