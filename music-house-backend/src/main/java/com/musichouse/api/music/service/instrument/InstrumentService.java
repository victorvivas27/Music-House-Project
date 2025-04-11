package com.musichouse.api.music.service.instrument;

import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.InstrumentInterface;
import com.musichouse.api.music.repository.*;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.StringValidator;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import com.musichouse.api.music.service.category.CategoryValidator;
import com.musichouse.api.music.service.themeService.ThemeValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

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
    private final CategoryValidator categoryValidator;
    private final ThemeValidator themeValidator;
    private final InstrumentBuilder instrumentBuilder;
    private final InstrumentValidator instrumentValidator;
    private final ImageCleaner imageCleaner;

    @Override
    @CacheEvict(value = "instruments", allEntries = true)
    public InstrumentDtoExit createInstrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentDtoEntrance)
            throws ResourceNotFoundException {

        instrumentValidator.validateUniqueName(instrumentDtoEntrance);

        Instrument instrument = instrumentBuilder.buildInstrumentWithImages(files, instrumentDtoEntrance);

        Instrument savedInstrument = instrumentRepository.save(instrument);

        return mapper.map(savedInstrument, InstrumentDtoExit.class);
    }


    @Override
    @Cacheable(value = "instruments")
    public Page<InstrumentDtoExit> getAllInstruments(Pageable pageable) {

        Page<Instrument> instrumentPage = instrumentRepository.findAll(pageable);

        return instrumentPage
                .map(instrument -> mapper
                        .map(instrument, InstrumentDtoExit.class));

    }

    @Override
    @Cacheable(value = "instruments", key = "#idInstrument")
    public InstrumentDtoExit getInstrumentById(UUID idInstrument) throws ResourceNotFoundException {

        Instrument instrument = instrumentValidator.validateInstrumentId(idInstrument);

        return mapper.map(instrument, InstrumentDtoExit.class);
    }


    @Override
    @CacheEvict(value = "instruments", allEntries = true)
    public InstrumentDtoExit updateInstrument(InstrumentDtoModify instrumentDtoModify) throws ResourceNotFoundException {

        Instrument instrumentToUpdate = instrumentBuilder.buildInstrument(instrumentDtoModify);

        instrumentToUpdate = instrumentRepository.save(instrumentToUpdate);

        return mapper.map(instrumentToUpdate, InstrumentDtoExit.class);
    }


    @Override
    @Transactional
    @CacheEvict(value = "instruments", allEntries = true)
    public void deleteInstrument(UUID idInstrument) throws ResourceNotFoundException {

        Instrument instrument = instrumentValidator.validateInstrumentId(idInstrument);

        instrumentValidator.validateNoReservations(idInstrument);

        favoriteRepository.deleteByInstrumentIdInstrument(idInstrument);

        List<String> imageUrls = imageCleaner.extractImageUrls(instrument.getImageUrls());

        instrumentRepository.delete(instrument);

        imageCleaner.deleteAllImagesFromS3(imageUrls);
    }


    @Cacheable(
            value = "instruments",
            key = "#name + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()"
    )
    public Page<InstrumentDtoExit> searchInstrument(String name, Pageable pageable)
            throws IllegalArgumentException {

        StringValidator.validateBasicText(name, name);

        Page<Instrument> instruments = instrumentRepository.findByNameContainingIgnoreCase(name.trim(), pageable);

        return instruments.map(instrument -> mapper.map(instrument, InstrumentDtoExit.class));

    }

}
