package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressAddDtoEntrance {

    @NotNull(message = "El id del user es obligatorio")
    private UUID idUser;

    @Size(min = 2, max = 100, message = "La calle debe tener entre {min} y {max} caracteres")
    @NotNull(message = "La calle es obligatoria")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "La calle solo debe contener letras, acentos y espacios")
    private String street;

    @PositiveOrZero(message = "El número debe ser positivo o cero")
    @NotNull(message = "El número es obligatorio")
    private Long number;

    @Size(min = 2, max = 100, message = "La ciudad debe tener entre {min} y {max} caracteres")
    @NotNull(message = "La ciudad es obligatoria")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "La ciudad solo debe contener letras, acentos y espacios")
    private String city;

    @Size(min = 2, max = 100, message = "El estado debe tener entre {min} y {max} caracteres")
    @NotNull(message = "El estado es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "El estado solo debe contener letras, acentos y espacios")
    private String state;

    @Size(min = 2, max = 100, message = "El país debe tener entre {min} y {max} caracteres")
    @NotNull(message = "El país es obligatorio")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "El país solo debe contener letras, acentos y espacios")
    private String country;
}
