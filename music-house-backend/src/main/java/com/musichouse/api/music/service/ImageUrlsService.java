package com.musichouse.api.music.service;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.musichouse.api.music.dto.dto_entrance.ImageUrlsDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ImagesUrlsDtoExit;
import com.musichouse.api.music.dto.dto_modify.ImageUrlsDtoModify;
import com.musichouse.api.music.entity.ImageUrls;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.ImageUrlsInterface;
import com.musichouse.api.music.repository.ImageUrlsRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.s3utils.S3UrlParser;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class ImageUrlsService implements ImageUrlsInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ImageUrlsService.class);
    private final ImageUrlsRepository imageUrlsRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;
    private final AWSS3Service awss3Service;

    @Override
    public List<ImagesUrlsDtoExit> addImageUrls(List<MultipartFile> files, ImageUrlsDtoEntrance imageUrlsDtoEntrance)
            throws ResourceNotFoundException {

        UUID instrumentId = imageUrlsDtoEntrance.getIdInstrument();

        if (instrumentId == null) {
            throw new IllegalArgumentException("El ID del instrumento no puede ser nulo");
        }

        Instrument instrument = instrumentRepository.findById(instrumentId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));


        List<String> imageUrls = awss3Service.uploadFilesToS3Instrument(files, instrumentId);

        List<ImageUrls> imageUrlEntities = imageUrls.stream().map(url -> {
            ImageUrls imageUrlEntity = new ImageUrls();
            imageUrlEntity.setImageUrl(url);
            imageUrlEntity.setInstrument(instrument);
            return imageUrlEntity;
        }).toList();

// Guardar todas en base de datos
        List<ImageUrls> savedImages = imageUrlsRepository.saveAll(imageUrlEntities);

        return savedImages.stream().map(image -> {
            return ImagesUrlsDtoExit.builder()
                    .idImage(image.getIdImage())
                    .idInstrument(instrumentId)
                    .imageUrl(image.getImageUrl())
                    .registDate(image.getRegistDate())
                    .build();
        }).toList();
    }


    @Override
    public List<ImagesUrlsDtoExit> getAllImageUrls() {
        List<ImagesUrlsDtoExit> imagesUrlsDtoExits = imageUrlsRepository.findAll().stream()
                .map(imageUrls -> mapper.map(imageUrls, ImagesUrlsDtoExit.class)).toList();
        return imagesUrlsDtoExits;
    }


    @Override
    public ImagesUrlsDtoExit getImageUrlsById(UUID idImage) throws ResourceNotFoundException {
        ImageUrls imageUrls = imageUrlsRepository.findById(idImage).orElse(null);
        if (imageUrls == null) {
            throw new ResourceNotFoundException("Imagen no encontrada con ID " + idImage);
        }
        return mapper.map(imageUrls, ImagesUrlsDtoExit.class);
    }


    @Override
    public ImagesUrlsDtoExit updateImageUrls(ImageUrlsDtoModify imageUrlsDtoModify) throws ResourceNotFoundException {
        ImageUrls imageUrlsToUpdate = imageUrlsRepository.findById(imageUrlsDtoModify.getIdImage())
                .orElseThrow(() -> new ResourceNotFoundException("Imagen no encontrada con ID " + imageUrlsDtoModify.getIdImage()));
        imageUrlsToUpdate.setImageUrl(imageUrlsDtoModify.getImageUrl());
        imageUrlsRepository.save(imageUrlsToUpdate);
        return mapper.map(imageUrlsToUpdate, ImagesUrlsDtoExit.class);
    }


    @Transactional
    @Override
    public void deleteImageUrls(UUID idInstrument, UUID idImage) throws ResourceNotFoundException {
        ImageUrls image = imageUrlsRepository.findById(idImage)
                .filter(img -> img.getInstrument().getIdInstrument().equals(idInstrument))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Imagen no encontrada o no pertenece al instrumento con ID " + idInstrument
                ));

        Instrument instrument = image.getInstrument();

        // 🔥 Remover manualmente de la lista para que Hibernate lo refleje correctamente
        instrument.getImageUrls().removeIf(img -> img.getIdImage().equals(idImage));

        // 💾 Guardar los cambios en Instrument (opcional, pero seguro)
        instrumentRepository.save(instrument);

        // 🗑️ Eliminar de la base de datos
        imageUrlsRepository.delete(image);
        System.out.println(">>> Imagen eliminada de BD");

        // ☁️ Eliminar de S3
        String imageUrl = image.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                String key = S3UrlParser.extractKeyFromS3Url(imageUrl);
                LOGGER.info("Key extraída: {}", key);
                awss3Service.deleteFileFromS3(key);
                LOGGER.info("Imagen eliminada de S3");
            } catch (AmazonS3Exception e) {
                LOGGER.error("Error AWS S3: {}", e.getErrorMessage(), e);
            } catch (Exception e) {
                LOGGER.error("Error inesperado al eliminar de S3", e);
            }
        }
    }


    @Override
    public List<ImagesUrlsDtoExit> getImageUrlsByInstrumentId(UUID instrumentId) {
        List<ImageUrls> imageUrls = imageUrlsRepository.findByInstrumentId(instrumentId);

        return imageUrls.stream()
                .map(image -> ImagesUrlsDtoExit.builder()
                        .idImage(image.getIdImage())
                        .idInstrument(image.getInstrument().getIdInstrument())
                        .registDate(image.getRegistDate())
                        .imageUrl(image.getImageUrl())
                        .build()
                ).toList();
    }
}
