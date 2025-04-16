package com.musichouse.api.music.service.availableDate;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.AvailableDateInterface;
import com.musichouse.api.music.repository.AvailableDateRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AvailableDateService implements AvailableDateInterface {

    private final AvailableDateRepository availableDateRepository;
    private final InstrumentRepository instrumentRepository;
    private final ModelMapper mapper;
    private final InstrumentValidator instrumentValidator;
    private final AvailableDateValidator availableDateValidator;
    private final AvailableDateBuilder availableDateBuilder;

    @Override
    @CacheEvict(value = "availableDates", allEntries = true)
    public List<AvailableDateDtoExit> addAvailableDates(List<AvailableDateDtoEntrance> availableDatesDtoList) throws ResourceNotFoundException {

        List<AvailableDateDtoExit> result = new ArrayList<>();

        for (AvailableDateDtoEntrance dto : availableDatesDtoList) {

            Instrument instrument = instrumentValidator.validateInstrumentId(dto.getIdInstrument());

            availableDateValidator.validateFutureDate(dto.getDateAvailable());

            Optional<AvailableDate> existing = availableDateRepository.findByInstrumentIdInstrumentAndDateAvailable(dto.getIdInstrument(), dto.getDateAvailable());

            AvailableDate entity = availableDateBuilder.createOrUpdate(dto, instrument, existing);

            AvailableDate saved = availableDateRepository.save(entity);

            result.add(availableDateBuilder.toDto(saved));
        }

        return result;
    }


    /**
     * encontrar todas las fechas disponibles por ID de instrumento
     */
    @Transactional
    @Override
    public List<AvailableDateDtoExit> findByInstrumentIdInstrument(UUID idInstrument)
            throws ResourceNotFoundException {

        Instrument instrument = instrumentValidator.validateInstrumentId(idInstrument);


        List<AvailableDate> availableDates = availableDateRepository.findByInstrumentIdInstrument(idInstrument);

        List<AvailableDate> filtered = availableDateBuilder.filterOnlyAvailable(availableDates);

        return filtered.stream()
                .map(availableDateBuilder::toDto)
                .toList();
    }


    /**
     * buscar todos los instrumentos por rango de fechas
     */

    @Transactional
    public List<AvailableDateDtoExit> findAllInstrumentByDatesRange(LocalDate startDate, LocalDate endDate) throws ResourceNotFoundException {
        List<AvailableDate> availableDates = availableDateRepository.findByDateAvailableBetween(startDate, endDate);
        if (availableDates.isEmpty()) {
            throw new ResourceNotFoundException("No hay fechas disponibles en el rango de fechas proporcionado.");
        }
        return availableDates.stream().filter(AvailableDate::getAvailable).map(availableDate -> mapper.map(availableDate, AvailableDateDtoExit.class)).collect(Collectors.toList());
    }


    @Transactional
    public void deletePastAvailableDates() {
        LocalDate today = LocalDate.now();
        availableDateRepository.deleteByDateAvailableBefore(today);
    }
}
