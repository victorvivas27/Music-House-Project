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
public class CharacteristicDtoModify {

    @NotNull(message = "El ID de las características es obligatorio")
    private UUID idCharacteristic;

    @NotBlank(message = "El estuche es obligatorio")
    @Size(max = 50, message = "El estuche no puede tener más de {max} caracteres")
    private String instrumentCase;

    @NotNull(message = "El soporte es obligatorio")
    @Size(max = 50, message = "El soporte no puede tener más de {max} caracteres")
    private String support;

    @NotBlank(message = "El afinador es obligatorio")
    @Size(max = 50, message = "El afinador no puede tener más de {max} caracteres")
    private String tuner;

    @NotNull(message = "El micrófono es obligatorio")
    @Size(max = 50, message = "El microfono no puede tener más de {max} caracteres")
    private String microphone;

    @NotBlank(message = "El soporte para teléfono es obligatorio")
    @Size(max = 50, message = "El soporte para teléfono no puede tener más de {max} caracteres")
    private String phoneHolder;
}
