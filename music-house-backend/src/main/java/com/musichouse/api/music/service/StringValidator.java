package com.musichouse.api.music.service;

public class StringValidator {

    private static final String VALID_CHARACTERS_REGEX = ".*[^a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ\\s].*";

    /**
     * Valida que un string no sea nulo, vacío ni contenga caracteres inválidos.
     *
     * @param input     El texto a validar.
     * @param fieldName El nombre del campo (para el mensaje de error).
     * @throws IllegalArgumentException si el texto es inválido.
     */
    public static void validateBasicText(String input, String fieldName) {
        if (input == null || input.trim().isEmpty() || input.matches(VALID_CHARACTERS_REGEX)) {
            throw new IllegalArgumentException(
                    "El campo '" + fieldName + "' es inválido. Ingrese solo letras, números o espacios.");
        }
    }
}