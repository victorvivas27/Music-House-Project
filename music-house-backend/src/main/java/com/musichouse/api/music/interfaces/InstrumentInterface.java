package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.InstrumentDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.InstrumentDtoExit;
import com.musichouse.api.music.dto.dto_modify.InstrumentDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface InstrumentInterface {
    InstrumentDtoExit createInstrument(List<MultipartFile> files, InstrumentDtoEntrance instrumentsDtoEntrance)
            throws ResourceNotFoundException;

    List<InstrumentDtoExit> getAllInstruments();

    InstrumentDtoExit getInstrumentById(UUID idInstrument) throws ResourceNotFoundException;

    InstrumentDtoExit updateInstrument(InstrumentDtoModify instrumentDtoModify) throws ResourceNotFoundException;

    void deleteInstrument(UUID idInstrument) throws ResourceNotFoundException;
}
