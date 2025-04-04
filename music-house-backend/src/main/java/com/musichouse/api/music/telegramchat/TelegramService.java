package com.musichouse.api.music.telegramchat;

import com.musichouse.api.music.dto.dto_exit.ReservationDtoExit;
import com.musichouse.api.music.util.CodeGenerator;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Service
@AllArgsConstructor
public class TelegramService {
    private final MyTelegramBot telegramBot;

    @Async
    public void enviarMensajeDeBienvenida(Long telegramChatId, String userName, String lastName, String email) {
        String codigoDescuento = CodeGenerator.generateCodeRandom();


        String mensajeDeBienvenida = String.format(
                "¡Bienvenido a Music House, %s %s! Gracias por registrarte. " +
                        "Este es tu código de descuento único: %s. Úsalo aquí: http://34.192.181.246",
                userName, lastName, codigoDescuento);

        SendMessage mensajeAEnviar = new SendMessage();
        mensajeAEnviar.setChatId(telegramChatId.toString());
        mensajeAEnviar.setText(mensajeDeBienvenida);

        try {

            Thread.sleep(1500);
            telegramBot.execute(mensajeAEnviar);
            telegramBot.mostrarOpcionesSecundarias(telegramChatId);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void enviarMensajeDeReserva(Long telegramChatId, ReservationDtoExit reservation) {
        double totalPrice = reservation.getTotalPrice().doubleValue();
        String mensajeDeReserva = String.format(
                "¡Hola %s %s! Tu reserva ha sido confirmada exitosamente.\n\n" +
                        "Detalles de la Reserva:\n" +
                        "Nombre del Instrumento: %s\n" +
                        "Fecha de Inicio: %s\n" +
                        "Fecha de Fin: %s\n" +
                        "Precio Total: %.2f\n" +
                        "Nombre: %s\n" +
                        "Apellido: %s\n" +
                        "Email: %s\n" +
                        "Ciudad: %s\n" +
                        "País: %s\n",
                reservation.getName(),
                reservation.getLastName(),
                reservation.getInstrumentName(),
                reservation.getStartDate().toString(),
                reservation.getEndDate().toString(),
                totalPrice,
                reservation.getName(),
                reservation.getLastName(),
                reservation.getEmail(),
                reservation.getCity(),
                reservation.getCountry()
        );

        SendPhoto mensajeAEnviar = new SendPhoto();
        mensajeAEnviar.setChatId(telegramChatId.toString());
        mensajeAEnviar.setPhoto(new InputFile(reservation.getImageUrl()));
        mensajeAEnviar.setCaption(mensajeDeReserva);

        try {
            Thread.sleep(1500);
            telegramBot.execute(mensajeAEnviar);
            telegramBot.mostrarOpcionesSecundarias(telegramChatId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    @Async
    public void enviarMensajeDeCancelacion(Long telegramChatId, String userName, String lastName) {
        String codigoDescuento = CodeGenerator.generateCodeRandom();

        String mensajeDeCancelacion = String.format(
                "¡Hola %s %s! Lamentamos que hayas cancelado tu alquiler. " +
                        "Si te arrepientes, aquí tienes un código de descuento único: %s. " +
                        "Úsalo aquí: http://34.192.181.246. ¡Esperamos verte pronto!",
                userName, lastName, codigoDescuento);

        SendMessage mensajeAEnviar = new SendMessage();
        mensajeAEnviar.setChatId(telegramChatId.toString());
        mensajeAEnviar.setText(mensajeDeCancelacion);

        try {
            Thread.sleep(1500);
            telegramBot.execute(mensajeAEnviar);
            telegramBot.mostrarOpcionesSecundarias(telegramChatId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            e.printStackTrace();
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
