package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CharacteristicDtoEntrance {

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
