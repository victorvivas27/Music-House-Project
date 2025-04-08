package com.musichouse.api.music.exception;

public class DuplicateImageException extends RuntimeException {
    public DuplicateImageException(String message) {
        super(message);
    }
}