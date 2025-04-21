package com.musichouse.api.music.s3utils;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

public class S3UrlParser {

    public static String extractKeyFromS3Url(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }

        try {
            // 🟢 1️⃣ Reemplazar espacios en la URL con "%20" para asegurar compatibilidad

            String encodedUrl = imageUrl.replace(" ", "%20");

            // 🟢 2️⃣ Convertir la URL en un objeto URI
            URI uri = new URI(encodedUrl);

            // 🟢 3️⃣ Extraer el path (clave completa en S3) y decodificar caracteres especiales
            String key = URLDecoder.decode(uri.getPath().substring(1), StandardCharsets.UTF_8.name());


            return key;
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Error al procesar la URL de la imagen", e);
        }
    }


}
