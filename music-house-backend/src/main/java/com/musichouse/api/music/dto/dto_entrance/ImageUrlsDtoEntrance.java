package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImageUrlsDtoEntrance {

    @NotNull(message = "El id del instrumento es obligatorio")
    private UUID idInstrument;

    @NotBlank(message = "La URL de la imagen no puede estar vacía")
    @Size(max = 1024, message = "La longitud máxima de la URL de la imagen es de {max} caracteres")
    private String imageUrl;

}
