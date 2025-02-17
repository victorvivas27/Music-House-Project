package com.musichouse.api.music.config;

import com.musichouse.api.music.service.AvailableDateService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class SchedulingTasks {
    private static final Logger logger = LoggerFactory.getLogger(SchedulingTasks.class);
    private final AvailableDateService availableDateService;

    //@Scheduled(cron = "*/30 * * * * ?") // Cada 10 segundos para pruebas
    @Scheduled(cron = "0 0 0 * * ?") // Todos los días a medianoche
    public void deletePastAvailableDates() {
        logger.info("Ejecutando tarea programada: eliminar PastAvailableDates");
        availableDateService.deletePastAvailableDates();
    }
}
