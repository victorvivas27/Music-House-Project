package com.musichouse.api.music.service.instrument;

import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.DuplicateNameException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.HasName;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class InstrumentValidator {
    private final InstrumentRepository instrumentRepository;
    private final ReservationRepository reservationRepository;
    private final FavoriteRepository favoriteRepository;

    public void validateUniqueName(HasName dto) {
        instrumentRepository.findByNameIgnoreCase(dto.getName())
                .ifPresent(existing -> {
                    throw new DuplicateNameException(
                            "Ya existe un instrumento con ese nombre: " + dto.getName());
                });
    }

    public Instrument validateInstrumentId(UUID idInstrument)
            throws ResourceNotFoundException {
        return instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instrumento con ID " + idInstrument + " no encontrada"));
    }


    public void validateNoReservations(UUID idInstrument) {
        boolean hasReservedDates = reservationRepository.existsByIdInstrument(idInstrument);
        if (hasReservedDates) {
            throw new IllegalArgumentException("No se puede eliminar el instrumento porque tiene fechas reservadas.");
        }
    }


}
