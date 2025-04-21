package com.musichouse.api.music.service.reservation;

import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.infra.MailManager;
import com.musichouse.api.music.telegramchat.TelegramService;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@AllArgsConstructor
public class ReservationNotifier {

    private final MailManager mailManager;
    private final TelegramService telegramService;

    public void notifyReservation(ReservationDtoExit dto, String reservationCode, User user)
            throws MessagingException, IOException {

        mailManager.sendReservationConfirmation(
                dto.getEmail(),
                dto.getName(),
                dto.getLastName(),
                dto.getInstrumentName(),
                dto.getStartDate(),
                dto.getEndDate(),
                reservationCode,
                dto.getTotalPrice(),
                dto.getImageUrl()
        );

        telegramService.enviarMensajeDeReserva(user.getTelegramChatId(), dto);
    }
}
