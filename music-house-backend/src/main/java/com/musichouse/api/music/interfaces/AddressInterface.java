package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.AddressAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AddressDtoExit;
import com.musichouse.api.music.dto.dto_modify.AddressDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;

import java.util.List;
import java.util.UUID;

public interface AddressInterface {
    AddressDtoExit addAddress(AddressAddDtoEntrance addressAddDtoEntrance) throws ResourceNotFoundException;

    List<AddressDtoExit> getAllAddress();

    AddressDtoExit getAddressById(UUID idAddress) throws ResourceNotFoundException;

    AddressDtoExit updateAddress(AddressDtoModify addressDtoModify) throws ResourceNotFoundException;

    void deleteAddress(UUID idAddress) throws ResourceNotFoundException;
}
