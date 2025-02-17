package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstrumentDtoEntrance {

    @NotBlank(message = "El nombre del instrumento es obligatorio")
    @Size(max = 100, message = "El nombre del instrumento debe tener como máximo {max} caracteres")
    private String name;

    @Size(max = 1024, message = "La descripción del instrumento debe tener como máximo {max} caracteres")
    private String description;

    @NotNull(message = "El precio de alquiler es obligatorio")
    @PositiveOrZero(message = "El precio de alquiler debe ser positivo o cero")
    private BigDecimal rentalPrice;

    @NotNull(message = "El peso del instrumento es obligatorio")
    @PositiveOrZero(message = "El peso debe ser positivo o cero")
    private BigDecimal weight;

    @NotBlank(message = "Las medidas  del instrumento es obligatorio")
    private String measures;

    @NotNull(message = "el ID de la categoria no deve estar en blanco")
    private UUID idCategory;

    @NotNull(message = "el ID de la tematica no deve estar en blanco")
    private UUID idTheme;

    @NotNull(message = "Debe cargar al menos una imagen al crear el instrumento")
    @Valid
    private List<String> imageUrls;

    @NotNull(message = "Las características del instrumento deben estar presentes")
    @Valid
    private CharacteristicDtoEntrance characteristic;
}
