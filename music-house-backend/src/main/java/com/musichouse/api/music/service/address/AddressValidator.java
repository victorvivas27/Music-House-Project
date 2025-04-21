package com.musichouse.api.music.service.address;

import com.musichouse.api.music.entity.Address;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.AddressRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class AddressValidator {
    private final AddressRepository addressRepository;

    public Address validateAddressId(UUID idAddress) throws ResourceNotFoundException {

        return addressRepository.findById(idAddress)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Direccion con ID " + idAddress + " no encontrada"));
    }

}
