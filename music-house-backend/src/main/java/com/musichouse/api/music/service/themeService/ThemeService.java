package com.musichouse.api.music.service.themeService;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.ThemeInterface;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ThemeRepository;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.StringValidator;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@AllArgsConstructor
public class ThemeService implements ThemeInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ThemeService.class);
    private final ThemeRepository themeRepository;
    private final InstrumentRepository instrumentRepository;
    private final ModelMapper mapper;
    private final AWSS3Service awss3Service;
    private final S3FileDeleter s3FileDeleter;
    private final ThemeValidator themeValidator;
    private final ThemeBuilder themeBuilder;
    private final ImageCleaner imageCleaner;

    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public ThemeDtoExit createTheme(ThemeDtoEntrance themeDtoEntrance, MultipartFile file)
            throws ResourceNotFoundException {

        themeValidator.validateUniqueName(themeDtoEntrance);

        themeValidator.validateDuplicateImageByFilename(file.getOriginalFilename());

        Theme theme = themeBuilder.buildThemeWithImage(themeDtoEntrance, file);


        Theme saved = themeRepository.save(theme);

        return mapper.map(saved, ThemeDtoExit.class);
    }


    @Override
    @Cacheable(value = "themes")
    public Page<ThemeDtoExit> getAllThemes(Pageable pageable) {

        Page<Theme> themesPage = themeRepository.findAll(pageable);

        return themesPage.map(theme -> mapper.map(theme, ThemeDtoExit.class));

    }

    @Override
    @Cacheable(value = "themes", key = "#idTheme")
    public ThemeDtoExit getThemeById(UUID idTheme)
            throws ResourceNotFoundException {

        Theme theme = themeValidator.validateThemeId(idTheme);

        return mapper.map(theme, ThemeDtoExit.class);
    }

    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public ThemeDtoExit updateTheme(ThemeDtoModify themeDtoModify, MultipartFile file)
            throws ResourceNotFoundException {

        Theme themeToUpdate = themeValidator.validateThemeId(themeDtoModify.getIdTheme());

        themeValidator.validateUniqueName(themeDtoModify, themeDtoModify.getIdTheme());

        themeToUpdate.setThemeName(themeDtoModify.getThemeName());

        themeToUpdate.setDescription(themeDtoModify.getDescription());

        Theme theme = themeBuilder.updateThemeImageIfPresent(themeToUpdate, file);

        theme = themeRepository.save(themeToUpdate);

        return mapper.map(themeToUpdate, ThemeDtoExit.class);
    }


    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public void deleteTheme(UUID idTheme)
            throws ResourceNotFoundException {

        Theme themeDelete = themeValidator.validateThemeId(idTheme);

        themeValidator.validateInstrumentAssociation(themeDelete.getIdTheme());

        imageCleaner.deleteImageFromS3(themeDelete.getImageUrlTheme());

        themeRepository.deleteById(idTheme);


    }


    @Cacheable(
            value = "themes",
            key = "#themeName + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()"
    )
    public Page<ThemeDtoExit> searchTheme(String themeName, Pageable pageable)
            throws IllegalArgumentException {

        StringValidator.validateBasicText(themeName, themeName);

        Page<Theme> themes = themeRepository.findByThemeNameContainingIgnoreCase(themeName.trim(), pageable);

        return themes.map(theme -> mapper.map(theme, ThemeDtoExit.class));

    }

}
