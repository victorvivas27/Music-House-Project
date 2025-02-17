package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.dto.dto_modify.ReservationDtoModify;
import com.musichouse.api.music.entity.Address;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.InvalidReservationDurationException;
import com.musichouse.api.music.exception.ReservationAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.interfaces.ReservationInterface;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ReservationRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.telegramchat.TelegramService;
import com.musichouse.api.music.util.CodeGenerator;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ReservationService implements ReservationInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(ReservationService.class);
    private final ReservationRepository reservationRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;
    private final UserRepository userRepository;
    private final TelegramService telegramService;
    @Autowired
    private final MailManager mailManager;

    public ReservationDtoExit createReservation(ReservationDtoEntrance reservationDtoEntrance) throws ResourceNotFoundException, MessagingException, IOException {
        UUID instrumentId = reservationDtoEntrance.getIdInstrument();
        UUID userId = reservationDtoEntrance.getIdUser();
        Instrument instrument = instrumentRepository.findById(instrumentId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID:" + instrumentId + " proporcionado"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con el ID:" + userId + " proporcionado"));

        // Verificar si el usuario ya tiene una reserva para este instrumento
        Reservation existingReservationForUser = reservationRepository.findByUserAndInstrument(user, instrument);
        if (existingReservationForUser != null) {
            throw new ReservationAlreadyExistsException
                    ("El usuario con ID: " + userId + " ya tiene una reserva para el instrumento con ID: " + instrumentId);
        }

        long rentalDays = ChronoUnit.DAYS.between(reservationDtoEntrance.getStartDate(), reservationDtoEntrance.getEndDate());
        if (rentalDays < 1) {
            throw new InvalidReservationDurationException("La duración mínima del alquiler debe ser de 24 horas.");
        }
        BigDecimal totalPrice = instrument.getRentalPrice().multiply(BigDecimal.valueOf(rentalDays));

        Reservation reservation = new Reservation();
        reservation.setInstrument(instrument);
        reservation.setUser(user);
        reservation.setStartDate(reservationDtoEntrance.getStartDate());
        reservation.setEndDate(reservationDtoEntrance.getEndDate());
        reservation.setTotalPrice(totalPrice);

        Reservation reservationSaved = reservationRepository.save(reservation);
        ReservationDtoExit reservationDtoExit = mapper.map(reservation, ReservationDtoExit.class);
        reservationDtoExit.setTotalPrice(totalPrice);
        reservationDtoExit.setName(user.getName());
        reservationDtoExit.setLastName(user.getLastName());
        reservationDtoExit.setEmail(user.getEmail());
        reservationDtoExit.setCity(user.getAddresses().isEmpty() ? "N/A" : user.getAddresses().iterator().next().getCity());
        reservationDtoExit.setCountry(user.getAddresses().isEmpty() ? "N/A" : user.getAddresses().iterator().next().getCountry());
        reservationDtoExit.setInstrumentName(instrument.getName());

        String imageUrl = instrument.getImageUrls().isEmpty() ? "" : instrument.getImageUrls().get(0).getImageUrl();
        reservationDtoExit.setImageUrl(imageUrl);

        String reservationCode = CodeGenerator.generateCodeRandom();
        mailManager.sendReservationConfirmation(
                user.getEmail(),
                user.getName(),
                user.getLastName(),
                instrument.getName(),
                reservation.getStartDate(),
                reservation.getEndDate(),
                reservationCode,
                totalPrice,
                imageUrl);
        telegramService.enviarMensajeDeReserva(user.getTelegramChatId(), reservationDtoExit);
        return reservationDtoExit;
    }

    @Override
    public List<ReservationDtoExit> getAllReservation() {
        List<ReservationDtoExit> reservationDtoExits = reservationRepository.findAll().stream()
                .map(reservation -> {
                    ReservationDtoExit dtoExit = mapper.map(reservation, ReservationDtoExit.class);
                    User user = reservation.getUser();
                    if (user != null) {
                        dtoExit.setIdUser(user.getIdUser());
                        dtoExit.setName(user.getName());
                        dtoExit.setLastName(user.getLastName());
                        dtoExit.setEmail(user.getEmail());
                        if (!user.getAddresses().isEmpty()) {
                            Address address = user.getAddresses().iterator().next();
                            dtoExit.setCity(address.getCity());
                            dtoExit.setCountry(address.getCountry());
                        }
                    }
                    Instrument instrument = reservation.getInstrument();
                    if (instrument != null) {
                        dtoExit.setIdInstrument(instrument.getIdInstrument());
                        dtoExit.setInstrumentName(instrument.getName());
                        if (!instrument.getImageUrls().isEmpty()) {
                            dtoExit.setImageUrl(instrument.getImageUrls().get(0).getImageUrl());
                        }
                    }
                    return dtoExit;
                }).toList();
        return reservationDtoExits;
    }

    @Override
    public ReservationDtoExit getReservationById(UUID idReservation) throws ResourceNotFoundException {
        return null;
    }

    @Override
    public List<ReservationDtoExit> getReservationByUserId(UUID userId) throws ResourceNotFoundException {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);
        if (reservations.isEmpty()) {
            throw new ResourceNotFoundException("No reservations found for user id: " + userId);
        }
        return reservations.stream()
                .map(reservation -> {
                    ReservationDtoExit dtoExit = mapper.map(reservation, ReservationDtoExit.class);
                    User user = reservation.getUser();
                    if (user != null) {
                        dtoExit.setIdUser(user.getIdUser());
                        dtoExit.setName(user.getName());
                        dtoExit.setLastName(user.getLastName());
                        dtoExit.setEmail(user.getEmail());
                        if (!user.getAddresses().isEmpty()) {
                            Address address = user.getAddresses().iterator().next();
                            dtoExit.setCity(address.getCity());
                            dtoExit.setCountry(address.getCountry());
                        }
                    }
                    Instrument instrument = reservation.getInstrument();
                    if (instrument != null) {
                        dtoExit.setIdInstrument(instrument.getIdInstrument());
                        dtoExit.setInstrumentName(instrument.getName());
                        if (!instrument.getImageUrls().isEmpty()) {
                            dtoExit.setImageUrl(instrument.getImageUrls().get(0).getImageUrl());
                        }
                    }
                    return dtoExit;
                }).toList();
    }

    @Override
    public ReservationDtoExit updateReservation(ReservationDtoModify reservationDtoModify) throws ResourceNotFoundException {
        return null;
    }

    @Override
    public void deleteReservation(UUID idInstrument, UUID idUser, UUID idReservation) throws ResourceNotFoundException {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID " + idUser));
        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con ID " + idInstrument));
        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva no encontrada con ID " + idReservation));
        if (!reservation.getUser().getIdUser().equals(idUser) || !reservation.getInstrument().getIdInstrument().equals(idInstrument)) {
            throw new ResourceNotFoundException("Reserva no encontrada para el usuario con ID " + idUser +
                    " y el instrumento con ID " + idInstrument);
        }
        telegramService.enviarMensajeDeCancelacion(user.getTelegramChatId(), user.getName(), user.getLastName());
        reservationRepository.delete(reservation);
    }

}
