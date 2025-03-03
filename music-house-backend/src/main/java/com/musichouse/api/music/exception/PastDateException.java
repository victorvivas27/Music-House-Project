package com.musichouse.api.music.exception;

public class PastDateException extends RuntimeException {
    public PastDateException(String message) {
        super(message);
    }
}
