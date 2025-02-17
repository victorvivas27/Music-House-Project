package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.AddressAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.AddressDtoExit;
import com.musichouse.api.music.dto.dto_modify.AddressDtoModify;
import com.musichouse.api.music.entity.Address;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.AddressInterface;
import com.musichouse.api.music.repository.AddressRepository;
import com.musichouse.api.music.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AddressService implements AddressInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(AddressService.class);
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;

    @Override
    public AddressDtoExit addAddress(AddressAddDtoEntrance addressAddDtoEntrance) throws ResourceNotFoundException {
        UUID userId = addressAddDtoEntrance.getIdUser();
        if (userId == null) {
            throw new IllegalArgumentException("El idUser no puede ser nulo");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con id: " + userId));
        Address address = new Address();
        address.setStreet(addressAddDtoEntrance.getStreet());
        address.setNumber(addressAddDtoEntrance.getNumber());
        address.setCity(addressAddDtoEntrance.getCity());
        address.setState(addressAddDtoEntrance.getState());
        address.setCountry(addressAddDtoEntrance.getCountry());
        address.setUser(user);
        Address addressSave = addressRepository.save(address);
        AddressDtoExit addressDtoExit = new AddressDtoExit();
        addressDtoExit.setIdAddress(addressSave.getIdAddress());
        addressDtoExit.setRegistDate(new Date());
        addressDtoExit = mapper.map(addressSave, AddressDtoExit.class);
        addressDtoExit.setIdUser(userId);
        return addressDtoExit;
    }

    @Override
    public List<AddressDtoExit> getAllAddress() {
        List<AddressDtoExit> addressDtoExits = addressRepository.findAll().stream()
                .map(address -> mapper.map(address, AddressDtoExit.class)).toList();
        return addressDtoExits;

    }

    @Override
    public AddressDtoExit getAddressById(UUID idAddress) throws ResourceNotFoundException {
        Address address = addressRepository.findById(idAddress).orElse(null);
        AddressDtoExit addressDtoExit = null;
        if (address != null) {
            addressDtoExit = mapper.map(address, AddressDtoExit.class);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + idAddress);
        }

        return addressDtoExit;
    }

    @Override
    public AddressDtoExit updateAddress(AddressDtoModify addressDtoModify) throws ResourceNotFoundException {
        Address addressToUpdate = addressRepository.findById(addressDtoModify.getIdAddress())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + addressDtoModify.getIdAddress()));
        addressToUpdate.setStreet(addressDtoModify.getStreet());
        addressToUpdate.setNumber(addressDtoModify.getNumber());
        addressToUpdate.setCity(addressDtoModify.getCity());
        addressToUpdate.setState(addressDtoModify.getState());
        addressToUpdate.setCountry(addressDtoModify.getCountry());
        addressRepository.save(addressToUpdate);
        return mapper.map(addressToUpdate, AddressDtoExit.class);
    }

    @Override
    public void deleteAddress(UUID idAddress) throws ResourceNotFoundException {
        Address addressToDelete = addressRepository.findById(idAddress)
                .orElseThrow(() -> new ResourceNotFoundException("Address with id " + idAddress + " not found"));
        User user = addressToDelete.getUser();
        if (user != null) {
            user.getAddresses().remove(addressToDelete);
            userRepository.save(user);
        }
        addressRepository.deleteById(idAddress);

    }
}







