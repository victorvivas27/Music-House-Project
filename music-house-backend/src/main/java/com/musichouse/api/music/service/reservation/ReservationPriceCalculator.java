package com.musichouse.api.music.service.reservation;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class ReservationPriceCalculator {

    public BigDecimal calculateTotalPrice(BigDecimal rentalPricePerDay, LocalDate startDate, LocalDate endDate) {

        long rentalDays = ChronoUnit.DAYS.between(startDate, endDate);

        return rentalPricePerDay.multiply(BigDecimal.valueOf(rentalDays));
    }
}

