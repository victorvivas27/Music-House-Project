package com.musichouse.api.music.config;

import com.musichouse.api.music.service.AvailableDateService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class SchedulingTasks {
    private static final Logger logger = LoggerFactory.getLogger(SchedulingTasks.class);
    private final AvailableDateService availableDateService;

    /**
     * 🕛 Ejecuta la tarea programada todos los días a medianoche
     */
    @Scheduled(cron = "0 0 0 * * ?") // Todos los días a las 00:00
    public void deletePastAvailableDates() {
        logger.info("⏳ Ejecutando tarea programada: eliminar fechas disponibles pasadas...");
        availableDateService.deletePastAvailableDates();
    }

    /**
     * 🚀 Ejecuta la eliminación cuando la aplicación inicia
     */
    @EventListener(ApplicationReadyEvent.class)
    public void deletePastAvailableDatesOnStartup() {
        logger.info("🚀 Aplicación iniciada: eliminando fechas disponibles pasadas...");
        availableDateService.deletePastAvailableDates();
    }
}
