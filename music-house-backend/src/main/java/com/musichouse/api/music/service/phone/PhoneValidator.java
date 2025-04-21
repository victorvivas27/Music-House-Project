package com.musichouse.api.music.service.phone;

import com.musichouse.api.music.entity.Phone;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.PhoneRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class PhoneValidator {
    private final PhoneRepository phoneRepository;

    public Phone validatePhoneId(UUID idPhone) throws ResourceNotFoundException {

        return phoneRepository.findById(idPhone)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Telefono  con ID " + idPhone + " no encontrada"));
    }
}
