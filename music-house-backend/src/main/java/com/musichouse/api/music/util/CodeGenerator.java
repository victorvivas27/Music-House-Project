package com.musichouse.api.music.util;

import java.util.Random;

public class CodeGenerator {

    // Define the length and characters used for the code
    private static final int CODE_LENGTH = 10;
    private static final String CHARACTERS = Constans.CODE;

    // Method to generate a reservation code
    public static String generateCodeRandom() {
        Random random = new Random();
        StringBuilder code = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            code.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return code.toString();
    }
}
