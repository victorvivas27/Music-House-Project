package com.musichouse.api.music;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MusicHouseApplication {

    private static final Logger LOGGER = LoggerFactory.getLogger(MusicHouseApplication.class);


    public static void main(String[] args) {
        SpringApplication.run(MusicHouseApplication.class, args);
        LOGGER.info("🎹 Let's hit the keys and start the musical journey with MusicHouseApplication! 🎵🌟 http://localhost:3000");


    }


}
