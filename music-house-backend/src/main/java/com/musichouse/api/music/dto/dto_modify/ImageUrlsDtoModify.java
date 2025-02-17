package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class ImageUrlsDtoModify {

    @NotNull(message = "El idImage es obligatorio")
    private UUID idImage;

    @NotBlank(message = "La URL de la imagen no puede estar vacía")
    @Size(max = 1024, message = "La longitud máxima de la URL de la imagen es de {max} caracteres")
    private String imageUrl;
}
