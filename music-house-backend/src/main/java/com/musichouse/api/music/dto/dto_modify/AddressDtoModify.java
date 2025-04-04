package com.musichouse.api.music.dto.dto_modify;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressDtoModify {

    @NotNull(message = "El idAdrress  es obligatorio")
    private UUID idAddress;

    @NotBlank(message = "La calle es obligatoria")
    @Size(min = 2, max = 100, message = "La calle debe tener entre {min} y {max} caracteres")
    private String street;

    @NotNull(message = "El número es obligatorio")
    @PositiveOrZero(message = "El número debe ser positivo o cero")
    private Long number;

    @NotBlank(message = "La ciudad es obligatoria")
    @Size(min = 2, max = 100, message = "La ciudad debe tener entre {min} y {max} caracteres")
    private String city;

    @NotBlank(message = "El estado es obligatorio")
    @Size(min = 2, max = 100, message = "El estado debe tener entre {min} y {max} caracteres")
    private String state;

    @NotBlank(message = "El país es obligatorio")
    @Size(min = 2, max = 100, message = "El país debe tener entre {min} y {max} caracteres")
    private String country;
}
