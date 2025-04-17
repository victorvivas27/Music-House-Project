package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.BusinessRuleException;
import com.musichouse.api.music.exception.InvalidReservationDurationException;
import com.musichouse.api.music.exception.ReservationAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.ReservationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Component
@AllArgsConstructor
public class ReservationValidator {
    private final ReservationRepository reservationRepository;

    public void validateUserHasNoExistingReservation(User user, Instrument instrument) {

        Reservation existing = reservationRepository.findByUserAndInstrument(user, instrument);
        if (existing != null) {

            throw new ReservationAlreadyExistsException(
                    "El usuario : "
                            + user.getName()
                            + user.getLastName()
                            +
                            " ya tiene una reserva para el instrumento "
                            + instrument.getName()
            );
        }
    }

    public void validateRentalDuration(LocalDate start, LocalDate end) {

        long rentalDays = ChronoUnit.DAYS.between(start, end);

        if (rentalDays < 1) {

            throw new InvalidReservationDurationException(

                    "La duración mínima del alquiler debe ser de 24 horas.");
        }
    }

    public Reservation validateReservationId(UUID idResevation)
            throws ResourceNotFoundException {
        return reservationRepository.findById(idResevation)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "La reserva  con ID " + idResevation + " no encontrada"));
    }

    public void validateUserAndInstrumentMatchReservation(Reservation reservation, UUID idUser, UUID idInstrument)
            throws ResourceNotFoundException {

        boolean userMatch = reservation.getUser().getIdUser().equals(idUser);
        boolean instrumentMatch = reservation.getInstrument().getIdInstrument().equals(idInstrument);

        if (!userMatch || !instrumentMatch) {
            throw new ResourceNotFoundException("Reserva no encontrada para el usuario con ID " + idUser +
                    " y el instrumento con ID " + idInstrument);
        }
    }

    public void validateInstrumentIsAvailable(UUID instrumentId, LocalDate startDate, LocalDate endDate) {
        boolean existsConflict = reservationRepository.existsByInstrumentAndDateRange(instrumentId, startDate, endDate);

        if (existsConflict) {
            throw new BusinessRuleException("El instrumento ya está reservado en el rango seleccionado.");
        }
    }

    public void validateReservationConditions(User user, Instrument instrument, LocalDate startDate, LocalDate endDate) {
        validateUserHasNoExistingReservation(user, instrument);
        validateInstrumentIsAvailable(instrument.getIdInstrument(), startDate, endDate);
    }
}
