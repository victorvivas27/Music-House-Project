package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Reservation;
import com.musichouse.api.music.entity.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class ReservationBuilder {

    public Reservation buildReservation(
            User user,
            Instrument instrument,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal totalPrice) {

        return Reservation.builder()
                .user(user)
                .instrument(instrument)
                .startDate(startDate)
                .endDate(endDate)
                .totalPrice(totalPrice)
                .build();
    }

    public ReservationDtoExit buildDtoReservationExit(
            Reservation reservation,
            User user,
            Instrument instrument,
            BigDecimal totalPrice) {

        String city = user.getAddresses().isEmpty()
                ? "N/A"
                : user.getAddresses().iterator().next().getCity();

        String country = user.getAddresses().isEmpty()
                ? "N/A"
                : user.getAddresses().iterator().next().getCountry();

        String imageUrl = instrument.getImageUrls().isEmpty()
                ? ""
                : instrument.getImageUrls().get(0).getImageUrl();

        return ReservationDtoExit.builder()
                .idReservation(reservation.getIdReservation())
                .idUser(user.getIdUser())
                .idInstrument(instrument.getIdInstrument())
                .startDate(reservation.getStartDate())
                .endDate(reservation.getEndDate())
                .totalPrice(totalPrice)
                .name(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .city(city)
                .country(country)
                .instrumentName(instrument.getName())
                .imageUrl(imageUrl)
                .registDate(reservation.getRegistDate())
                .modifiedDate(reservation.getModifiedDate())
                .build();
    }

    public ReservationDtoExit buildDtoFromEntity(Reservation reservation) {
        User user = reservation.getUser();
        Instrument instrument = reservation.getInstrument();

        String city = (user != null && !user.getAddresses().isEmpty())
                ? user.getAddresses().iterator().next().getCity()
                : "N/A";

        String country = (user != null && !user.getAddresses().isEmpty())
                ? user.getAddresses().iterator().next().getCountry()
                : "N/A";

        String imageUrl = (instrument != null && !instrument.getImageUrls().isEmpty())
                ? instrument.getImageUrls().get(0).getImageUrl()
                : "";

        return ReservationDtoExit.builder()
                .idReservation(reservation.getIdReservation())
                .startDate(reservation.getStartDate())
                .endDate(reservation.getEndDate())
                .totalPrice(reservation.getTotalPrice())
                .registDate(reservation.getRegistDate())
                .modifiedDate(reservation.getModifiedDate())

                .idUser(user != null ? user.getIdUser() : null)
                .name(user != null ? user.getName() : null)
                .lastName(user != null ? user.getLastName() : null)
                .email(user != null ? user.getEmail() : null)
                .city(city)
                .country(country)

                .idInstrument(instrument != null ? instrument.getIdInstrument() : null)
                .instrumentName(instrument != null ? instrument.getName() : null)
                .imageUrl(imageUrl)
                .build();
    }
}
