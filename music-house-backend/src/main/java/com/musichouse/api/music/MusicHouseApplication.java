package com.musichouse.api.music;

import com.musichouse.api.music.config.TelegramBotConfig;
import com.musichouse.api.music.telegramchat.MyTelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@SpringBootApplication
@ComponentScan(basePackages = {"com.musichouse.api.music"})
public class MusicHouseApplication {

    private static final Logger LOGGER = LoggerFactory.getLogger(MusicHouseApplication.class);
    @Autowired
    private TelegramBotConfig telegramBotConfig;

    public static void main(String[] args) {
        SpringApplication.run(MusicHouseApplication.class, args);
        LOGGER.info("🎹 Let's hit the keys and start the musical journey with MusicHouseApplication! 🎵🌟");


    }


    @Bean
    public CommandLineRunner initMyTelegramBot(MyTelegramBot myTelegramBot) {
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
