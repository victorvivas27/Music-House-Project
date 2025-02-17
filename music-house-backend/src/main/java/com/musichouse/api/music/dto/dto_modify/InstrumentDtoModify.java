package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.musichouse.api.music.dto.dto_entrance.CharacteristicDtoEntrance;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InstrumentDtoModify {

    @NotNull(message = "El idInstrument  es obligatorio")
    private UUID idInstrument;

    @NotBlank(message = "El nombre del instrumento es obligatorio")
    @Size(max = 100, message = "El nombre del instrumento debe tener como máximo {max} caracteres")
    private String name;

    @Size(max = 1024, message = "La descripción del instrumento debe tener como máximo {max} caracteres")
    private String description;

    @NotNull(message = "El peso del instrumento es obligatorio")
    @PositiveOrZero(message = "El peso debe ser positivo o cero")
    private BigDecimal weight;

    @NotNull(message = "Las medidas  del instrumento es obligatorio")
    private String measures;

    @NotNull(message = "El precio de alquiler es obligatorio")
    @PositiveOrZero(message = "El precio de alquiler debe ser positivo o cero")
    private BigDecimal rentalPrice;

    @NotNull(message = "El id de la categoría es obligatorio")
    private UUID idCategory;

    @NotNull(message = "El id de la tematica es obligatorio")
    private UUID idTheme;

    @NotNull(message = "Las características del instrumento es obligatorio")
    private CharacteristicDtoEntrance characteristic;

}
