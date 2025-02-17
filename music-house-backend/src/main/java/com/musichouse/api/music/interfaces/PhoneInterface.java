package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

public interface PhoneInterface {
    PhoneDtoExit addPhone(PhoneAddDtoEntrance phoneAddDtoEntrance) throws ResourceNotFoundException;

    List<PhoneDtoExit> getAllPhone();

    PhoneDtoExit getPhoneById(UUID idPhone) throws ResourceNotFoundException;

    PhoneDtoExit updatePhone(PhoneDtoModify phoneDtoModify) throws ResourceNotFoundException;

    void deletePhone(UUID idPhone) throws ResourceNotFoundException;
}
