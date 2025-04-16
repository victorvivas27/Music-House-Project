package com.musichouse.api.music.service.address;

import com.musichouse.api.music.dto.dto_entrance.AddressAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AddressDtoExit;
import com.musichouse.api.music.dto.dto_modify.AddressDtoModify;
import com.musichouse.api.music.entity.Address;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.AddressInterface;
import com.musichouse.api.music.repository.AddressRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.user.UserValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class AddressService implements AddressInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(AddressService.class);
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;
    private final UserValidator userValidator;
    private final AddressValidator addressValidator;

    @Override
    @CacheEvict(value = {"addresses", "users"}, allEntries = true)
    public AddressDtoExit addAddress(AddressAddDtoEntrance addressAddDtoEntrance)
            throws ResourceNotFoundException {

        User user = userValidator.validateUserId(addressAddDtoEntrance.getIdUser());

        Address address = mapper.map(addressAddDtoEntrance, Address.class);

        address.setUser(user);

        Address savedAddress = addressRepository.save(address);

        AddressDtoExit dto = mapper.map(savedAddress, AddressDtoExit.class);

        dto.setIdUser(user.getIdUser());

        return dto;
    }

    @Override
    public AddressDtoExit getAddressById(UUID idAddress)
            throws ResourceNotFoundException {

        Address address = addressValidator.validateAddressId(idAddress);

        return mapper.map(address, AddressDtoExit.class);
    }

    @Override
    @CacheEvict(value = {"addresses", "users"}, allEntries = true)
    public AddressDtoExit updateAddress(AddressDtoModify addressDtoModify)
            throws ResourceNotFoundException {

        Address addressToUpdate = addressValidator.validateAddressId(addressDtoModify.getIdAddress());


        mapper.map(addressDtoModify, addressToUpdate);

        Address addressSaved = addressRepository.save(addressToUpdate);

        return mapper.map(addressSaved, AddressDtoExit.class);
    }

    @Override
    @CacheEvict(value = {"addresses", "users"}, allEntries = true)
    public void deleteAddress(UUID idAddress) throws ResourceNotFoundException {

        Address addressToDelete = addressValidator.validateAddressId(idAddress);

        User user = addressToDelete.getUser();

        if (user != null) {

            user.getAddresses().remove(addressToDelete);

            userRepository.save(user);
        }

        addressRepository.deleteById(idAddress);

    }
}







