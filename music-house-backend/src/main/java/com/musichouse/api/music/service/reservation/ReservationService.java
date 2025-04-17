package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.entity.AvailableDate;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.interfaces.ReservationInterface;
import com.musichouse.api.music.repository.AvailableDateRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ReservationRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import com.musichouse.api.music.service.user.UserValidator;
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
    private final UserValidator userValidator;
    private final InstrumentValidator instrumentValidator;
    private final ReservationValidator reservationValidator;
    private final ReservationPriceCalculator reservationPriceCalculator;
    private final ReservationBuilder reservationBuilder;
    private final ReservationNotifier reservationNotifier;
    private final AvailableDateRepository availableDateRepository;
    @Autowired
    private final MailManager mailManager;

    public ReservationDtoExit createReservation(ReservationDtoEntrance reservationDtoEntrance)
            throws ResourceNotFoundException, MessagingException, IOException {

        User user = userValidator.validateUserId(reservationDtoEntrance.getIdUser());

        Instrument instrument = instrumentValidator.validateInstrumentId(reservationDtoEntrance.getIdInstrument());

        reservationValidator.validateReservationConditions(
                user,
                instrument,
                reservationDtoEntrance.getStartDate(),
                reservationDtoEntrance.getEndDate());

        reservationValidator.validateRentalDuration(reservationDtoEntrance.getStartDate(), reservationDtoEntrance.getEndDate());

        BigDecimal totalPrice = reservationPriceCalculator.calculateTotalPrice(
                instrument.getRentalPrice(),
                reservationDtoEntrance.getStartDate(),
                reservationDtoEntrance.getEndDate()
        );

        Reservation reservation = reservationBuilder.
                buildReservation(
                        user,
                        instrument,
                        reservationDtoEntrance.getStartDate(),
                        reservationDtoEntrance.getEndDate(),
                        totalPrice
                );

        Reservation reservationSaved = reservationRepository.save(reservation);
        // 🔒 Bloquear fechas reservadas
        List<AvailableDate> datesToUpdate =
                availableDateRepository.findByInstrumentIdInstrumentAndDateAvailableBetween(
                        instrument.getIdInstrument(),
                        reservation.getStartDate(),
                        reservation.getEndDate()
                );

        datesToUpdate.forEach(date -> date.setAvailable(false));
        availableDateRepository.saveAll(datesToUpdate);

        ReservationDtoExit reservationDtoExit = reservationBuilder.buildDtoReservationExit(
                reservationSaved,
                user,
                instrument,
                totalPrice
        );

        String reservationCode = CodeGenerator.generateCodeRandom();

        reservationNotifier.notifyReservation(reservationDtoExit, reservationCode, user);

        return reservationDtoExit;
    }


    @Override
    public List<ReservationDtoExit> getReservationByUserId(UUID userId) {
        List<Reservation> reservations = reservationRepository.findByUserId(userId);

        return reservations.stream()
                .map(reservationBuilder::buildDtoFromEntity)
                .toList();
    }


    @Override
    public void deleteReservation(UUID idInstrument, UUID idUser, UUID idReservation) throws ResourceNotFoundException {

        User user = userValidator.validateUserId(idUser);

        Instrument instrument = instrumentValidator.validateInstrumentId(idInstrument);

        Reservation reservation = reservationValidator.validateReservationId(idReservation);

        reservationValidator.validateUserAndInstrumentMatchReservation(reservation, idUser, idInstrument);

        telegramService.enviarMensajeDeCancelacion(user.getTelegramChatId(), user.getName(), user.getLastName());

        reservationRepository.delete(reservation);
    }

}
