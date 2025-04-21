package com.musichouse.api.music.config;

import com.musichouse.api.music.telegramchat.MyTelegramBot;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@Configuration
public class TelegramBotInitializer {

    @Bean
    public CommandLineRunner registerTelegramBot(MyTelegramBot myTelegramBot) {
        return args -> {
            TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
            try {
                botsApi.registerBot(myTelegramBot);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        };
    }
}
