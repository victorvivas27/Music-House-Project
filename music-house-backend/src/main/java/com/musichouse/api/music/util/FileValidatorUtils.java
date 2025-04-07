package com.musichouse.api.music.util;

import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

public class FileValidatorUtils {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
    );

    /**
     * Valida una lista de archivos MultipartFile según varios criterios:
     * - No deben ser nulos ni vacíos.
     * - Cada archivo no debe estar vacío.
     * - Deben ser de tipo imagen permitido (JPEG, PNG, JPG).
     *
     * @param files Lista de archivos subidos.
     * @return Lista de mensajes de error encontrados. Vacía si todo está OK.
     */
    public static List<String> validateImages(List<MultipartFile> files) {
        List<String> errors = new ArrayList<>();

        if (files == null || files.isEmpty()) {
            errors.add("Debe subir al menos una imagen.");
            return errors;
        }

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);

            if (file.isEmpty()) {
                errors.add("La imagen #" + (i + 1) + " está vacía.");
            }

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
                errors.add("La imagen #" + (i + 1) + " tiene un tipo no permitido: " + contentType);
            }
        }

        return errors;
    }
}
