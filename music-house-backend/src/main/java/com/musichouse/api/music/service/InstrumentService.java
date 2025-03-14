package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.CharacteristicDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.entity.*;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.InstrumentInterface;
import com.musichouse.api.music.repository.*;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InstrumentService implements InstrumentInterface {
    private static final Logger LOGGER = LoggerFactory.getLogger(InstrumentService.class);
    private final InstrumentRepository instrumentRepository;
    private final ModelMapper mapper;
    private final CategoryRepository categoryRepository;
    private final ThemeRepository themeRepository;
    private final AvailableDateRepository availableDateRepository;
    private final FavoriteRepository favoriteRepository;
    private final AWSS3Service awss3Service;

    @Override
    public InstrumentDtoExit createInstrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance)
            throws ResourceNotFoundException {

        Category category = categoryRepository.findById(instrumentDtoEntrance.getIdCategory())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la categoría con el ID proporcionado"));

        Theme theme = themeRepository.findById(instrumentDtoEntrance.getIdTheme())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la temática con el ID proporcionado"));

        // Crear entidad Instrument
        Instrument instrument = new Instrument();
        instrument.setName(instrumentDtoEntrance.getName());
        instrument.setDescription(instrumentDtoEntrance.getDescription());
        instrument.setRentalPrice(instrumentDtoEntrance.getRentalPrice());
        instrument.setWeight(instrumentDtoEntrance.getWeight());
        instrument.setMeasures(instrumentDtoEntrance.getMeasures());
        instrument.setCategory(category);
        instrument.setTheme(theme);

        // Guardar características
        CharacteristicDtoEntrance characteristicsDtoEntrance = instrumentDtoEntrance.getCharacteristic();
        Characteristics characteristics = new Characteristics();
        characteristics.setInstrumentCase(characteristicsDtoEntrance.getInstrumentCase());
        characteristics.setSupport(characteristicsDtoEntrance.getSupport());
        characteristics.setTuner(characteristicsDtoEntrance.getTuner());
        characteristics.setMicrophone(characteristicsDtoEntrance.getMicrophone());
        characteristics.setPhoneHolder(characteristicsDtoEntrance.getPhoneHolder());

        instrument.setCharacteristics(characteristics);

        // 📌 Subir imágenes a S3 y guardar URLs en la entidad
        List<String> imageUrls = awss3Service.uploadFilesToS3Instrument(files, instrumentDtoEntrance);

        List<ImageUrls> imageUrlEntities = imageUrls.stream().map(url -> {
            ImageUrls imageUrlEntity = new ImageUrls();
            imageUrlEntity.setImageUrl(url);
            imageUrlEntity.setInstrument(instrument);
            return imageUrlEntity;
        }).toList();

        instrument.setImageUrls(imageUrlEntities);

        // Guardar el instrumento en la base de datos
        Instrument savedInstrument = instrumentRepository.save(instrument);

        // Convertir la entidad guardada a DTO para devolver la respuesta
        return mapper.map(savedInstrument, InstrumentDtoExit.class);
    }


    @Override
    public List<InstrumentDtoExit> getAllInstruments() {
        return instrumentRepository.findAll().stream()
                .map(instrument -> mapper.map(instrument, InstrumentDtoExit.class))
                .toList();
    }

    @Override
    public InstrumentDtoExit getInstrumentById(UUID idInstrument) throws ResourceNotFoundException {
        Instrument instrument = instrumentRepository.findById(idInstrument).orElse(null);
        InstrumentDtoExit instrumentDtoExit = null;
        if (instrument != null) {
            instrumentDtoExit = mapper.map(instrument, InstrumentDtoExit.class);
        } else {
            throw new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado");
        }
        return instrumentDtoExit;
    }

    @Override
    public InstrumentDtoExit updateInstrument(InstrumentDtoModify instrumentDtoModify) throws ResourceNotFoundException {
        Category category = categoryRepository.findById(instrumentDtoModify.getIdCategory())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la categoría con el ID proporcionado"));
        Theme theme = themeRepository.findById(instrumentDtoModify.getIdTheme())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la temática con el ID proporcionado"));
        Instrument instrumentToUpdate = instrumentRepository.findById(instrumentDtoModify.getIdInstrument())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));
        instrumentToUpdate.setName(instrumentDtoModify.getName());
        instrumentToUpdate.setDescription(instrumentDtoModify.getDescription());
        instrumentToUpdate.setWeight(instrumentDtoModify.getWeight());
        instrumentToUpdate.setMeasures(instrumentDtoModify.getMeasures());
        instrumentToUpdate.setRentalPrice(instrumentDtoModify.getRentalPrice());
        instrumentToUpdate.setCategory(category);
        instrumentToUpdate.setTheme(theme);
        Characteristics characteristics = instrumentToUpdate.getCharacteristics();
        if (characteristics == null) {
            characteristics = new Characteristics();
            instrumentToUpdate.setCharacteristics(characteristics);
        }
        CharacteristicDtoEntrance characteristicsDtoEntrance = instrumentDtoModify.getCharacteristic();
        characteristics.setInstrumentCase(characteristicsDtoEntrance.getInstrumentCase());
        characteristics.setSupport(characteristicsDtoEntrance.getSupport());
        characteristics.setTuner(characteristicsDtoEntrance.getTuner());
        characteristics.setMicrophone(characteristicsDtoEntrance.getMicrophone());
        characteristics.setPhoneHolder(characteristicsDtoEntrance.getPhoneHolder());
        instrumentRepository.save(instrumentToUpdate);
        InstrumentDtoExit instrumentDtoExit = mapper.map(instrumentToUpdate, InstrumentDtoExit.class);
        return instrumentDtoExit;
    }




    @Override
    @Transactional
    public void deleteInstrument(UUID idInstrument) throws ResourceNotFoundException {

        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));

        List<String> imageUrls = instrument.getImageUrls().stream()
                .map(ImageUrls::getImageUrl)  // 📌 Obtener todas las URLs de las imágenes
                .collect(Collectors.toList());

        LOGGER.info("🟢 IMÁGENES A ELIMINAR: " + imageUrls);

        // 🟢 1️⃣ ELIMINAR TODAS LAS IMÁGENES ASOCIADAS EN S3
        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.isEmpty()) {
                String key = extractKeyFromS3Url(imageUrl);
                awss3Service.deleteFileFromS3(key);
            }
        }

        // 🟢 2️⃣ VERIFICAR SI TIENE FECHAS RESERVADAS
        boolean hasReservedDates = availableDateRepository.existsByInstrumentIdInstrumentAndAvailableFalse(idInstrument);
        if (hasReservedDates) {
            throw new IllegalArgumentException("No se puede eliminar el instrumento porque tiene fechas reservadas.");
        }

        // 🟢 3️⃣ ELIMINAR TODAS LAS REFERENCIAS A FAVORITOS
        favoriteRepository.deleteByInstrumentIdInstrument(idInstrument);

        // 🟢 4️⃣ ELIMINAR EL INSTRUMENTO DE LA BASE DE DATOS
        instrumentRepository.delete(instrument);

        LOGGER.info("✅ INSTRUMENTO ELIMINADO CON ÉXITO");
    }



    public List<InstrumentDtoExit> searchInstruments(String name) {
        List<Instrument> instruments = instrumentRepository.findByNameContainingIgnoreCase(name);
        return instruments.stream()
                .map(instrument -> mapper.map(instrument, InstrumentDtoExit.class))
                .collect(Collectors.toList());
    }



    private String extractKeyFromS3Url(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }

        try {
            // 📌 Asegurar compatibilidad con espacios y caracteres especiales
            String encodedUrl = imageUrl.replace(" ", "%20");
            URI uri = new URI(encodedUrl);

            // 📌 Obtener el path de la URL y remover la primera barra "/"
            String key = URLDecoder.decode(uri.getPath().substring(1), StandardCharsets.UTF_8.name());

            LOGGER.info("🟢 Clave de imagen extraída: " + key);
            return key;
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Error al procesar la URL de la imagen", e);
        }
    }



}
