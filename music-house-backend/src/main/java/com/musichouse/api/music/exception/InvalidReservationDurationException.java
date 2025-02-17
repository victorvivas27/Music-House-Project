package com.musichouse.api.music.exception;

public class InvalidReservationDurationException extends RuntimeException {
    public InvalidReservationDurationException(String message) {
        super(message);
    }
}
