package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.entity.ImageUrls;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.DuplicateNameException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.ThemeInterface;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ThemeRepository;
import com.musichouse.api.music.s3utils.S3UrlParser;
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

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ThemeService implements ThemeInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ThemeService.class);
    private final ThemeRepository themeRepository;
    private final InstrumentRepository instrumentRepository;
    private final ModelMapper mapper;
    private final AWSS3Service awss3Service;

    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public ThemeDtoExit createTheme(List<MultipartFile> files, ThemeDtoEntrance themeDtoEntrance)
            throws ResourceNotFoundException {

        if (themeRepository.findByThemeNameIgnoreCase(themeDtoEntrance.getThemeName()).isPresent()) {
            throw new DuplicateNameException(
                    "Ya existe una temática con ese nombre: " + themeDtoEntrance.getThemeName());
        }


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

        Theme themeSaved = themeRepository.save(theme);

        ThemeDtoExit themeDtoExit = mapper.map(themeSaved, ThemeDtoExit.class);

        return themeDtoExit;
    }

    @Override
    @Cacheable(value = "themes")
    public Page<ThemeDtoExit> getAllThemes(Pageable pageable) {

        Page<Theme> themesPage = themeRepository.findAll(pageable);

        return themesPage.map(theme -> mapper.map(theme, ThemeDtoExit.class));

    }

    @Override
    @Cacheable(value = "themes", key = "#idTheme")
    public ThemeDtoExit getThemeById(UUID idTheme) throws ResourceNotFoundException {

        Theme theme = themeRepository.findById(idTheme)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Themeatica con ID " + idTheme + " no encontrada"));

        return mapper.map(theme, ThemeDtoExit.class);
    }

    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public ThemeDtoExit updateTheme(ThemeDtoModify themeDtoModify) throws ResourceNotFoundException {

        Theme themeToUpdate = themeRepository.findById(themeDtoModify.getIdTheme())
                .orElseThrow(() ->
                        new ResourceNotFoundException
                                ("Themeatica con ID " + themeDtoModify.getIdTheme() + " no encontrada"));

        themeRepository.findByThemeNameIgnoreCase(themeDtoModify.getThemeName())
                .ifPresent(theme -> {
                    if (!theme.getIdTheme().equals(themeDtoModify.getIdTheme())) {
                        throw new DuplicateNameException
                                ("Ya existe una thematica con ese nombre: " + themeDtoModify.getThemeName());
                    }
                });

        themeToUpdate.setThemeName(themeDtoModify.getThemeName());

        themeToUpdate.setDescription(themeDtoModify.getDescription());

        Theme theme = themeRepository.save(themeToUpdate);

        return mapper.map(themeToUpdate, ThemeDtoExit.class);
    }

    @Override
    @CacheEvict(value = "themes", allEntries = true)
    public void deleteTheme(UUID idTheme) throws ResourceNotFoundException {

        Theme themeDelete = themeRepository.findById(idTheme)
                .orElseThrow(() ->
                        new ResourceNotFoundException
                                ("No se encontro el idTheme: " + idTheme));

        List<Instrument> instruments = instrumentRepository.findByTheme(themeDelete);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException("No se puede eliminar el tema con id:" + idTheme +
                    " ya que está asociado con instrumentos");
        }

        List<String> imageUrls = themeDelete.getImageUrls().stream()
                .map(ImageUrls::getImageUrl)
                .collect(Collectors.toList());

        themeRepository.deleteById(idTheme);


        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.isEmpty()) {

                String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                awss3Service.deleteFileFromS3(key);


            }
        }
    }


    @Cacheable(
            value = "themes",
            key = "#themeName + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()"
    )
    public Page<ThemeDtoExit> searchTheme(String themeName, Pageable pageable) throws IllegalArgumentException {

        if (themeName == null ||
                themeName.trim().isEmpty() ||
                themeName.matches(".*[^a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ\\s].*")) {


            throw new IllegalArgumentException
                    ("El parámetro de búsqueda es inválido. Ingrese solo letras, números o espacios.");
        }

        Page<Theme> themes = themeRepository.findByThemeNameContainingIgnoreCase(themeName.trim(), pageable);

        return themes.map(theme -> mapper.map(theme, ThemeDtoExit.class));

    }

}
