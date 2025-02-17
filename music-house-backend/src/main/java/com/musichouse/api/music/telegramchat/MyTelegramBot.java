package com.musichouse.api.music.telegramchat;


import com.musichouse.api.music.config.TelegramBotConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendVideo;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
public class MyTelegramBot extends TelegramLongPollingBot {
    private final TelegramBotConfig telegramBotConfig;
    private final Map<Long, Boolean> inicializacionCompletadaMap = new HashMap<>();

    @Autowired
    public MyTelegramBot(TelegramBotConfig telegramBotConfig) {
        this.telegramBotConfig = telegramBotConfig;
    }

    @Override
    public String getBotUsername() {
        return telegramBotConfig.getBotUsername();
    }

    @Override
    public String getBotToken() {
        return telegramBotConfig.getBotToken();
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            Long chatId = update.getMessage().getChatId();

            if (messageText.equalsIgnoreCase("/start")) {
                Boolean inicializacionCompletada = inicializacionCompletadaMap.getOrDefault(chatId, false);
                if (!inicializacionCompletada) {
                    inicializacionCompletadaMap.put(chatId, false);
                    enviarMensaje("¡Bienvenido al bot de Music House! 🎵 Aquí encontrarás descuentos exclusivos y la mejor asistencia personalizada." +
                            "\n\nA continuación, te presento nuestro video introductorio. 👇", chatId);
                    enviarVideoIntroductorio(chatId);
                    mostrarOpcionesIniciales(chatId);
                    inicializacionCompletadaMap.put(chatId, true);
                } else {
                    enviarMensaje("Has reiniciado la conversación. Empezamos de nuevo.", chatId);
                    inicializacionCompletadaMap.put(chatId, false); // Reiniciar el estado
                    enviarMensaje("¡Bienvenido al bot de Music House! 🎵 Aquí encontrarás descuentos exclusivos y la mejor asistencia personalizada." +
                            "\n\nA continuación, te presento nuestro video introductorio. 👇", chatId);
                    enviarVideoIntroductorio(chatId);
                    mostrarOpcionesIniciales(chatId);
                    inicializacionCompletadaMap.put(chatId, true);
                }
            } else {
                enviarMensaje("No comprendo tu mensaje. 🤔", chatId);
            }
        } else if (update.hasCallbackQuery()) {
            manejarCallbackQuery(update);
        }
    }

    public void mostrarOpcionesIniciales(Long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());

        InlineKeyboardBuilder builder = new InlineKeyboardBuilder();
        builder.addRow("🎉 Promociones", "promociones");
        builder.addRow("🔍 Código de validación", "validacion");

        message.setText("¿Qué te gustaría hacer? Selecciona una de las opciones a continuación:");
        message.setReplyMarkup(builder.build());

        enviarMensaje(message, chatId);
    }

    public void mostrarOpcionesSecundarias(Long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());

        InlineKeyboardBuilder builder = new InlineKeyboardBuilder();
        builder.addRow("🎉 Promociones", "promociones");
        builder.addRow("🌐 Redes sociales", "redes");
        builder.addRow("🔚 Finalizar chat", "finalizar");

        message.setText("Aquí te dejo qué puedes seguir haciendo en el chat bot:");
        message.setReplyMarkup(builder.build());

        enviarMensaje(message, chatId);
    }

    public void mostrarPromociones(Long chatId) {
        String mensajePromociones = "¡Aquí están nuestras promociones! 🌟\n\n" +
                "1. ¡Alquila por 2 días y obtén un 10% de descuento en el segundo día! 🎸🎶\n" +
                "2. Alquila por 5 días y obtén el 50% de descuento en el quinto día. 🎹🎼\n" +
                "3. Alquila por 7 días y el séptimo día es gratis. 🎵🥁\n" +
                "4. Alquila cualquier instrumento por un mes y obtén una semana gratis. 🎻🎵\n" +
                "5. Promoción de fin de semana: Alquila desde el viernes y devuelve el lunes por el precio de dos días. 🎶🎹\n" +
                "6. Descuento para estudiantes: Presenta tu carnet de estudiante y obtén un 15% de descuento en cualquier alquiler. 🎓🎶\n" +
                "7. Primer alquiler: ¡Si es tu primera vez con nosotros, obtén un 20% de descuento en cualquier alquiler! 🥳🎉\n" +
                "8. Refiere a un amigo y ambos obtendrán un 10% de descuento en su próximo alquiler. 🤝🎵\n" +
                "9. Alquila un instrumento adicional y obtén un 30% de descuento en el segundo instrumento. 🎷🎼\n" +
                "10. Happy Hour: Alquila cualquier instrumento entre las 3 PM y 6 PM y obtén un 25% de descuento. 🕒🎶";

        enviarMensaje(mensajePromociones, chatId);
        mostrarOpcionesSecundarias(chatId);
    }

    public void mostrarRedesSociales(Long chatId) {
        String mensajeRedes = "Síguenos en nuestras redes sociales: 🌐\n\n" +
                "Facebook: [@MusicHouse](https://www.facebook.com)\n" +
                "Instagram: [@MusicHouse](https://www.instagram.com)\n" +
                "Twitter: [@MusicHouse](https://www.twitter.com)";

        enviarMensaje(mensajeRedes, chatId);
        mostrarOpcionesSecundarias(chatId);
    }

    private void manejarCallbackQuery(Update update) {
        String callbackData = update.getCallbackQuery().getData();
        Long chatId = update.getCallbackQuery().getMessage().getChatId();

        switch (callbackData) {
            case "promociones":
                mostrarPromociones(chatId);
                break;
            case "validacion":
                enviarMensaje("Tu número de validación es: " + chatId, chatId);
                mostrarOpcionesSecundarias(chatId);
                break;
            case "redes":
                mostrarRedesSociales(chatId);
                break;
            case "finalizar":
                enviarMensaje("¡Hasta pronto! 👋", chatId);
                inicializacionCompletadaMap.put(chatId, false); // Reset the initialization status when the chat is finished
                break;
            default:
                enviarMensaje("No comprendo tu mensaje. 🤔", chatId);
                break;
        }
    }

    private void enviarMensaje(String mensaje, Long chatId) {
        SendMessage message = new SendMessage();
        message.setChatId(chatId.toString());
        message.setText(mensaje);
        message.setParseMode("Markdown");
        message.setDisableWebPagePreview(true);

        enviarMensaje(message, chatId);
    }

    private void enviarMensaje(SendMessage message, Long chatId) {
        try {
            execute(message);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private void enviarVideoIntroductorio(Long chatId) {
        SendVideo sendVideo = new SendVideo();
        sendVideo.setChatId(chatId.toString());
        String videoPath = "src/main/resources/static/videos/introductorio.gif";
        InputFile videoFile = new InputFile(new File(videoPath));

        sendVideo.setVideo(videoFile);
        sendVideo.setCaption("Aquí tienes un video introductorio para conocer nuestros servicios. ☝️");

        try {
            execute(sendVideo);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}

