package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.ReservationDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import jakarta.mail.MessagingException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ReservationInterface {

    ReservationDtoExit createReservation(ReservationDtoEntrance reservationDtoEntrance)
            throws ResourceNotFoundException, MessagingException, IOException;


    public List<ReservationDtoExit> getReservationByUserId(UUID userId)
            throws ResourceNotFoundException;


    void deleteReservation(UUID idInstrument, UUID idUser, UUID idReservation)
            throws ResourceNotFoundException;
}
