package com.musichouse.api.music.util;

import lombok.*;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private HttpStatus status;  // Código de estado HTTP completo (ej. HttpStatus.BAD_REQUEST)
    private int statusCode;     // Código numérico (ej. 400, 404, 500)
    private String message;     // Mensaje descriptivo
    private Object error;       // Mensaje de error opcional (puede ser null)
    private T result;             // Datos de respuesta (puede ser cualquier objeto)


}