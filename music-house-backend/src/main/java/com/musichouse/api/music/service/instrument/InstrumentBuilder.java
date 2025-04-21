package com.musichouse.api.music.service.instrument;

import com.musichouse.api.music.dto.dto_entrance.CharacteristicDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.entity.*;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.category.CategoryValidator;
import com.musichouse.api.music.service.themeService.ThemeValidator;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Component
@AllArgsConstructor
public class InstrumentBuilder {
    private final CategoryValidator categoryValidator;
    private final ThemeValidator themeValidator;
    private final AWSS3Service awss3Service;
    private final InstrumentValidator instrumentValidator;

    public Instrument buildInstrumentWithImages(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance)
            throws ResourceNotFoundException {


        UUID generatedId = UUID.randomUUID();

        Category category = categoryValidator.validateCategoryId(instrumentDtoEntrance.getIdCategory());
        Theme theme = themeValidator.validateThemeId(instrumentDtoEntrance.getIdTheme());


        Instrument instrument = Instrument.builder()
                .idInstrument(generatedId)
                .name(instrumentDtoEntrance.getName())
                .description(instrumentDtoEntrance.getDescription())
                .rentalPrice(instrumentDtoEntrance.getRentalPrice())
                .weight(instrumentDtoEntrance.getWeight())
                .measures(instrumentDtoEntrance.getMeasures())
                .category(category)
                .theme(theme)
                .characteristics(buildCharacteristics(instrumentDtoEntrance.getCharacteristic()))
                .build();

        // Subir imágenes con el ID del instrumento
        List<String> imageUrls = awss3Service.uploadFilesToS3Instrument(files, generatedId);

        // Mapear imágenes a entidades y asignar instrumento
        List<ImageUrlsInstrument> imageUrlEntities = imageUrls.stream().map(url -> {
            ImageUrlsInstrument imageUrlEntity = new ImageUrlsInstrument();
            imageUrlEntity.setImageUrl(url);
            imageUrlEntity.setInstrument(instrument);
            return imageUrlEntity;
        }).toList();

        // Asignar las imágenes al instrumento
        instrument.setImageUrls(imageUrlEntities);

        return instrument;
    }


    public Instrument buildInstrument(InstrumentDtoModify dto) throws ResourceNotFoundException {

        Category category = categoryValidator.validateCategoryId(dto.getIdCategory());

        Theme theme = themeValidator.validateThemeId(dto.getIdTheme());

        Instrument instrument = instrumentValidator.validateInstrumentId(dto.getIdInstrument());

        instrument.setName(dto.getName());
        instrument.setDescription(dto.getDescription());
        instrument.setWeight(dto.getWeight());
        instrument.setMeasures(dto.getMeasures());
        instrument.setRentalPrice(dto.getRentalPrice());
        instrument.setCategory(category);
        instrument.setTheme(theme);
        instrument.setCharacteristics(buildCharacteristics(dto.getCharacteristic()));

        return instrument;


    }


    // Método para construir las características usando el builder de Lombok
    private Characteristics buildCharacteristics(CharacteristicDtoEntrance characteristicsDtoEntrance) {

        return Characteristics.builder()
                .instrumentCase(characteristicsDtoEntrance.getInstrumentCase())
                .support(characteristicsDtoEntrance.getSupport())
                .tuner(characteristicsDtoEntrance.getTuner())
                .microphone(characteristicsDtoEntrance.getMicrophone())
                .phoneHolder(characteristicsDtoEntrance.getPhoneHolder())
                .build();
    }

}
