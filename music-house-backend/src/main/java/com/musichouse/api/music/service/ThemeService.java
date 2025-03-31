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
    public ThemeDtoExit createTheme(List<MultipartFile> files, ThemeDtoEntrance themeDtoEntrance) throws ResourceNotFoundException {
        // Verificar si ya existe
        themeRepository.findByThemeNameIgnoreCase(themeDtoEntrance.getThemeName())
                .ifPresent(t -> {
                    throw new DuplicateNameException("Ya existe una temática con ese nombre: " + themeDtoEntrance.getThemeName());
                });


        Theme theme = mapper.map(themeDtoEntrance, Theme.class);
        UUID generatedId = UUID.randomUUID(); // 🔑 Generás el ID
        theme.setIdTheme(generatedId);

        // 📌 Subir imágenes a S3 y guardar URLs en la entidad
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
    public List<ThemeDtoExit> getAllThemes() {
        return themeRepository.findAll()
                .stream()
                .map(theme -> mapper.map(theme, ThemeDtoExit.class))
                .toList();


    }

    @Override
    public ThemeDtoExit getThemeById(UUID idTheme) throws ResourceNotFoundException {

        Theme theme = themeRepository.findById(idTheme).orElse(null);

        ThemeDtoExit themeDtoExit = null;

        if (theme != null) {
            themeDtoExit = mapper.map(theme, ThemeDtoExit.class);

        } else {
            throw new ResourceNotFoundException("Theme with id " + idTheme + " not found");
        }
        return themeDtoExit;
    }

    @Override
    public ThemeDtoExit updateTheme(ThemeDtoModify themeDtoModify) throws ResourceNotFoundException {

        themeDtoModify.setThemeName(themeDtoModify.getThemeName());

        Theme themeToUpdate = themeRepository.findById(themeDtoModify.getIdTheme())
                .orElseThrow(() ->
                        new ResourceNotFoundException
                                ("Theme with id " + themeDtoModify.getIdTheme() + " not found"));

        themeToUpdate.setThemeName(themeDtoModify.getThemeName());

        themeToUpdate.setDescription(themeDtoModify.getDescription());

        themeRepository.save(themeToUpdate);

        return mapper.map(themeToUpdate, ThemeDtoExit.class);
    }

    @Override
    public void deleteTheme(UUID idTheme) throws ResourceNotFoundException {

        Theme theme = themeRepository.findById(idTheme)
                .orElseThrow(() -> new ResourceNotFoundException
                        ("No se encontro el idTheme: " + idTheme));
        List<Instrument> instruments = instrumentRepository.findByTheme(theme);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException("No se puede eliminar el tema con id:" + idTheme +
                    " ya que está asociado con instrumentos");
        }
        // 📌 Guardar las URLs de las imágenes antes de eliminar la tematica
        List<String> imageUrls = theme.getImageUrls().stream()
                .map(ImageUrls::getImageUrl)
                .collect(Collectors.toList());

        themeRepository.deleteById(idTheme);

        // 📌 Ahora que la thematica  se eliminó, proceder con la eliminación de imágenes en S3
        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.isEmpty()) {

                String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                awss3Service.deleteFileFromS3(key);


            }
        }
    }


    public List<Theme> searchTheme(String themeName) throws IllegalArgumentException {

        if (themeName != null) {
            return themeRepository.findBythemeNameContaining(themeName);
        } else {
            throw new IllegalArgumentException("Parámetro de búsqueda inválido");
        }
    }

}
