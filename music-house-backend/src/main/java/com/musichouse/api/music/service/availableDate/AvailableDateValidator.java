package com.musichouse.api.music.service.availableDate;

import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.exception.PastDateException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.AvailableDateRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@AllArgsConstructor
public class AvailableDateValidator {
    private final AvailableDateRepository availableDateRepository;

    public void validateFutureDate(LocalDate date) {

        if (date.isBefore(LocalDate.now())) {

            throw new PastDateException("No se pueden agregar fechas pasadas");
        }
    }

    public AvailableDate validateAvaibleDateId(UUID idAvailableDate)
            throws ResourceNotFoundException {
        return availableDateRepository.findById(idAvailableDate)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Fecha disponible con ID " + idAvailableDate + " no encontrada"));
    }


}
