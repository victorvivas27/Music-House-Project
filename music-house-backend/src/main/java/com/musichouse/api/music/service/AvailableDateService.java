package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.dto.dto_modify.AvailableDateDtoModify;
import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.AvailableDateInterface;
import com.musichouse.api.music.repository.AvailableDateRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AvailableDateService implements AvailableDateInterface {

    private final AvailableDateRepository availableDateRepository;
    private final InstrumentRepository instrumentRepository;
    private final ModelMapper mapper;

    @Override
    public List<AvailableDateDtoExit> addAvailableDates(List<AvailableDateDtoEntrance> availableDatesDtoList) throws ResourceNotFoundException {
        List<AvailableDateDtoExit> addedDates = new ArrayList<>();
        for (AvailableDateDtoEntrance availableDateDto : availableDatesDtoList) {
            UUID instrumentId = availableDateDto.getIdInstrument();
            if (instrumentId == null) {
                throw new IllegalArgumentException("El ID del instrumento no puede ser nulo");
            }
            Instrument instrument = instrumentRepository.findById(instrumentId)
                    .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));
            Optional<AvailableDate> existingAvailableDateOpt =
                    availableDateRepository.findByInstrumentIdInstrumentAndDateAvailable
                            (instrumentId, availableDateDto.getDateAvailable());

            AvailableDate availableDate;
            if (existingAvailableDateOpt.isPresent()) {
                availableDate = existingAvailableDateOpt.get();
                availableDate.setAvailable(availableDateDto.getAvailable());
            } else {
                availableDate = new AvailableDate();
                availableDate.setDateAvailable(availableDateDto.getDateAvailable());
                availableDate.setInstrument(instrument);
                availableDate.setAvailable(availableDateDto.getAvailable());
            }
            AvailableDate availableDateSave = availableDateRepository.save(availableDate);
            AvailableDateDtoExit availableDateDtoExit = new AvailableDateDtoExit();
            availableDateDtoExit.setIdAvailableDate(availableDateSave.getIdAvailableDate());
            availableDateDtoExit.setRegistDate(new Date());
            availableDateDtoExit.setDateAvailable(availableDateSave.getDateAvailable());
            availableDateDtoExit.setAvailable(availableDateSave.getAvailable());
            availableDateDtoExit.setIdInstrument(instrumentId);
            addedDates.add(availableDateDtoExit);
        }
        return addedDates;
    }

    @Override
    public List<AvailableDateDtoExit> getAllAvailableDates() {
        return availableDateRepository.findAll().stream()
                .map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class))
                .collect(Collectors.toList());
    }


    @Override
    public AvailableDateDtoExit getAvailableDateById(UUID id) throws ResourceNotFoundException {
        AvailableDate availableDate = availableDateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fecha disponible no encontrada con el id: " + id));
        return mapper.map(availableDate, AvailableDateDtoExit.class);
    }

    /**
     * encontrar todas las fechas disponibles por ID de instrumento
     */
    @Transactional
    @Override
    public List<AvailableDateDtoExit> findByInstrumentIdInstrument(UUID idInstrument) throws ResourceNotFoundException {
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con el ID: " + idInstrument));
        List<AvailableDate> availableDates = availableDateRepository.findByInstrumentIdInstrument(idInstrument);
        if (availableDates.isEmpty()) {
            throw new ResourceNotFoundException("No hay fechas disponibles para el instrumento con ID: " + idInstrument);
        }
        return availableDates.stream()
                .filter(availableDate -> availableDate.getAvailable())
                .map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class))
                .collect(Collectors.toList());
    }

    @Override
    public AvailableDateDtoExit updateAvailableDate(AvailableDateDtoModify availableDateDtoModify)
            throws ResourceNotFoundException {
        AvailableDate availableDate = availableDateRepository.findById(availableDateDtoModify.getIdAvailableDate())
                .orElseThrow(() -> new ResourceNotFoundException
                        ("Fecha disponible no encontrada con el id: " + availableDateDtoModify.getIdAvailableDate()));

        Instrument instrument = instrumentRepository.findById(availableDateDtoModify.getIdInstrument())
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con el id: "
                        + availableDateDtoModify.getIdInstrument()));

        availableDate.setDateAvailable(availableDateDtoModify.getDateAvailable());
        availableDate.setInstrument(instrument);
        availableDate = availableDateRepository.save(availableDate);
        return mapper.map(availableDate, AvailableDateDtoExit.class);
    }

    @Transactional
    public void deleteAvailableDate(UUID idInstrument, UUID idAvailableDate) throws ResourceNotFoundException {
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con ID:" + idInstrument));
        boolean exists = availableDateRepository.existsById(idAvailableDate);
        if (exists) {
            availableDateRepository.deleteByIdInstrumentAndIdAvailableDate(idInstrument, idAvailableDate);
        } else {
            throw new ResourceNotFoundException("Fecha disponible no encontrada con ID:" + idAvailableDate);
        }
    }

    /**
     * encontrar todos los instrumentos de una fecha
     */
    @Transactional
    public List<AvailableDateDtoExit> findAllInstrumentsOfADates(LocalDate dateAvailable)
            throws ResourceNotFoundException {
        List<AvailableDate> availableDates = availableDateRepository.findByDateAvailableAndAvailableIsTrue(dateAvailable);
        if (availableDates.isEmpty()) {
            throw new ResourceNotFoundException("No hay fechas disponibles para la fecha: " + dateAvailable);
        }
        return availableDates.stream()
                .filter(AvailableDate::getAvailable)
                .map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class))
                .collect(Collectors.toList());
    }

    /**
     * encontrar todas las fechas disponibles por ID de instrumento
     */
    @Transactional
    public List<AvailableDateDtoExit> findAllAvailableDatesByInstrumentId(LocalDate dateAvailable, UUID idInstrument)
            throws ResourceNotFoundException {
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con el ID: " + idInstrument));
        Optional<AvailableDate> optionalAvailableDate = availableDateRepository.
                findByInstrumentIdInstrumentAndDateAvailable(idInstrument, dateAvailable);
        if (optionalAvailableDate.isEmpty()) {
            throw new ResourceNotFoundException
                    ("No hay fechas disponibles para el instrumento con ID: " +
                            idInstrument + " y la fecha: " + dateAvailable);
        }
        AvailableDate availableDate = optionalAvailableDate.get();
        if (!availableDate.getAvailable()) {
            throw new ResourceNotFoundException
                    ("La fecha: " + dateAvailable + " no está disponible para el instrumento con ID: " + idInstrument);
        }
        return List.of(mapper.map(availableDate, AvailableDateDtoExit.class));
    }

    /**
     * buscar todos los instrumentos por rango de fechas
     */

    @Transactional
    public List<AvailableDateDtoExit> findAllInstrumentByDatesRange(LocalDate startDate, LocalDate endDate)
            throws ResourceNotFoundException {
        List<AvailableDate> availableDates = availableDateRepository.findByDateAvailableBetween(startDate, endDate);
        if (availableDates.isEmpty()) {
            throw new ResourceNotFoundException("No hay fechas disponibles en el rango de fechas proporcionado.");
        }
        return availableDates.stream()
                .filter(AvailableDate::getAvailable)
                .map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class))
                .collect(Collectors.toList());
    }

    /**
     * encontrar fechas disponibles por ID de instrumento y rango
     */
    @Transactional
    public List<AvailableDateDtoExit> findAvailableDatesByInstrumentIDAndRange
    (LocalDate startDate, LocalDate endDate, UUID idInstrument) throws ResourceNotFoundException {
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con el ID: " + idInstrument));
        List<AvailableDate> availableDates = availableDateRepository.
                findByInstrumentIdInstrumentAndDateAvailableBetween(idInstrument, startDate, endDate);
        if (availableDates.isEmpty()) {
            throw new ResourceNotFoundException("No hay fechas disponibles para el instrumento con ID: "
                    + idInstrument + " en el rango de fechas proporcionado.");
        }
        return availableDates.stream()
                .filter(AvailableDate::getAvailable)
                .map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePastAvailableDates() {
        LocalDate today = LocalDate.now();
        availableDateRepository.deleteByDateAvailableBefore(today);
    }
}
