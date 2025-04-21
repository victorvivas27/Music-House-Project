package com.musichouse.api.music.service.imageUrlInstrument;

import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoAddInstrument;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.entity.ImageUrlsInstrument;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.ImageUrlsInstrumentInterface;
import com.musichouse.api.music.repository.ImageUrlsIntrumentRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.service.ImageCleaner;
import com.musichouse.api.music.service.awss3Service.AWSS3Service;
import com.musichouse.api.music.service.awss3Service.S3FileDeleter;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import com.musichouse.api.music.service.themeService.ThemeValidator;
import jakarta.transaction.Transactional;
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

@Service
@AllArgsConstructor
@Transactional
public class ImageUrlsInstrumentService implements ImageUrlsInstrumentInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ImageUrlsInstrumentService.class);
    private final ImageUrlsIntrumentRepository imageUrlsRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;
    private final AWSS3Service awss3Service;
    private final S3FileDeleter s3FileDeleter;
    private final ThemeValidator themeValidator;
    private final InstrumentValidator instrumentValidator;
    private final ImageUrlInstrumentBuilder imageUrlInstrumentBuilder;
    private final ImageUrlInstrumentValidator imageUrlInstrumentValidator;
    private final ImageCleaner imageCleaner;

    @Override
    @CacheEvict(value = "imagesByInstrument", allEntries = true)
    public List<ImagesUrlsDtoExit> addImageUrls(List<MultipartFile> files, ImageUrlsDtoAddInstrument imageUrlsDtoEntrance)
            throws ResourceNotFoundException {

        Instrument instrument = instrumentValidator.validateInstrumentId(imageUrlsDtoEntrance.getIdInstrument());

        List<String> imageUrls = awss3Service.uploadFilesToS3Instrument(files, imageUrlsDtoEntrance.getIdInstrument());

        List<ImageUrlsInstrument> imageUrlEntities = imageUrlInstrumentBuilder.buildImageUrlsInstrumentList(instrument, imageUrls);

        List<ImageUrlsInstrument> savedImages = imageUrlsRepository.saveAll(imageUrlEntities);

        return imageUrlInstrumentBuilder.buildList(savedImages, imageUrlsDtoEntrance.getIdInstrument());
    }


    @Override
    @Cacheable(
            value = "imagesByInstrument",
            key = "#idInstrument + '-' + #pageable.pageNumber + '-' + #pageable.pageSize"
    )
    public Page<ImagesUrlsDtoExit> getAllImageUrls(Pageable pageable) {
        return imageUrlsRepository.findAll(pageable)
                .map(imageUrls -> mapper.map(imageUrls, ImagesUrlsDtoExit.class));
    }


    @Transactional
    @Override
    @CacheEvict(value = "imagesByInstrument", key = "#idInstrument")
    public void deleteImageUrls(UUID idInstrument, UUID idImage) throws ResourceNotFoundException {

        ImageUrlsInstrument image = imageUrlInstrumentValidator.validateImageByIdAndInstrumentId(idInstrument, idImage);

        Instrument instrument = image.getInstrument();

        instrument.getImageUrls().removeIf(img -> img.getIdImage().equals(idImage));

        instrumentRepository.save(instrument);

        imageUrlsRepository.delete(image);

        imageCleaner.deleteImageFromS3(image.getImageUrl());
    }


    @Override
    @Cacheable(value = "imagesByInstrument", key = "#instrumentId")
    public List<ImagesUrlsDtoExit> getImageUrlsByInstrumentId(UUID instrumentId) throws ResourceNotFoundException {

        instrumentValidator.validateInstrumentId(instrumentId);

        List<ImageUrlsInstrument> imageUrls = imageUrlsRepository.findByInstrumentId(instrumentId);

        return imageUrlInstrumentBuilder.buildList(imageUrls, instrumentId);
    }
}
