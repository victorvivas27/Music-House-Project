package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.CharacteristicDtoEntrance;
import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.entity.*;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.InstrumentInterface;
import com.musichouse.api.music.repository.*;
import com.musichouse.api.music.s3utils.S3UrlParser;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private final ReservationRepository reservationRepository;
    private final S3FileDeleter s3FileDeleter;

    @Override
    public InstrumentDtoExit createInstrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance)
            throws ResourceNotFoundException {

        Category category = categoryRepository.findById(instrumentDtoEntrance.getIdCategory())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la categoría con el ID proporcionado"));

        Theme theme = themeRepository.findById(instrumentDtoEntrance.getIdTheme())
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró la temática con el ID proporcionado"));


        // Crear entidad Instrument
        Instrument instrument = new Instrument();
        UUID generatedId = UUID.randomUUID(); // 🔑 Generás el ID
        instrument.setIdInstrument(generatedId);
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
        List<String> imageUrls = awss3Service.uploadFilesToS3Instrument(files, generatedId);

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
        // 📌 Buscar el instrumento
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));

        // 📌 Verificar si tiene fechas reservadas antes de eliminarlo
        boolean hasReservedDates = reservationRepository.existsByIdInstrument(idInstrument);
        if (hasReservedDates) {
            throw new IllegalArgumentException("No se puede eliminar el instrumento porque tiene fechas reservadas.");
        }

        // 📌 Eliminar todas las referencias en Favoritos antes de eliminar el instrumento
        favoriteRepository.deleteByInstrumentIdInstrument(idInstrument);

        // 📌 Guardar las URLs de las imágenes antes de eliminar el instrumento
        List<String> imageUrls = instrument.getImageUrls().stream()
                .map(ImageUrls::getImageUrl)
                .collect(Collectors.toList());


        // 📌 Eliminar el instrumento de la base de datos primero
        instrumentRepository.delete(instrument);


        // 📌 Ahora que el instrumento se eliminó, proceder con la eliminación de imágenes en S3
        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.isEmpty()) {
                try {
                    String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                    s3FileDeleter.deleteFileFromS3(key);

                } catch (Exception e) {

                }
            }
        }
    }


    public List<InstrumentDtoExit> searchInstruments(String name) {
        List<Instrument> instruments = instrumentRepository.findByNameContainingIgnoreCase(name);
        return instruments.stream()
                .map(instrument -> mapper.map(instrument, InstrumentDtoExit.class))
                .collect(Collectors.toList());
    }

}
