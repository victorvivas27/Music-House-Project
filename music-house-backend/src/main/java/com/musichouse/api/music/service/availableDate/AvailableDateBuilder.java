package com.musichouse.api.music.service.availableDate;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.entity.Instrument;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class AvailableDateBuilder {

    public AvailableDate createOrUpdate(
            AvailableDateDtoEntrance dto,
            Instrument instrument,
            Optional<AvailableDate> existing) {

        AvailableDate entity = existing.orElseGet(AvailableDate::new);

        entity.setDateAvailable(dto.getDateAvailable());

        entity.setInstrument(instrument);

        entity.setAvailable(dto.getAvailable());

        return entity;
    }

    public AvailableDateDtoExit toDto(AvailableDate entity) {

        return AvailableDateDtoExit.builder()
                .idAvailableDate(entity.getIdAvailableDate())
                .registDate(entity.getRegistDate())
                .modifiedDate(entity.getModifiedDate())
                .dateAvailable(entity.getDateAvailable())
                .available(entity.getAvailable())
                .idInstrument(entity.getInstrument().getIdInstrument())
                .build();
    }

    public List<AvailableDate> filterOnlyAvailable(List<AvailableDate> dates) {
        return dates.stream()
                .filter(AvailableDate::getAvailable)
                .toList();
    }
}
