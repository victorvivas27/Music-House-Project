package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.AvailableDateDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AvailableDateDtoExit;
import com.musichouse.api.music.dto.dto_modify.AvailableDateDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

public interface AvailableDateInterface {

    public List<AvailableDateDtoExit> addAvailableDates(List<AvailableDateDtoEntrance> availableDatesDtoList) throws ResourceNotFoundException;

    List<AvailableDateDtoExit> getAllAvailableDates();

    AvailableDateDtoExit getAvailableDateById(UUID id) throws ResourceNotFoundException;

    List<AvailableDateDtoExit> findByInstrumentIdInstrument(UUID idInstrument) throws ResourceNotFoundException;

    AvailableDateDtoExit updateAvailableDate(AvailableDateDtoModify availableDateDtoModify) throws ResourceNotFoundException;

    public void deleteAvailableDate(UUID idAvailableDate, UUID idInstrument) throws ResourceNotFoundException;
}
