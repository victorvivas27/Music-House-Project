package com.musichouse.api.music.dto.dto_entrance;

import com.musichouse.api.music.interfaces.HasName;
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
public class InstrumentDtoEntrance implements HasName {


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

    @NotBlank(message = "Las medidas del instrumento son obligatorias")
    private String measures;

    @NotNull(message = "El ID de la categoría es obligatorio")
    private UUID idCategory;

    @NotNull(message = "El ID de la temática es obligatorio")
    private UUID idTheme;

    private List<String> imageUrls;

    @Valid
    @NotNull(message = "Las características del instrumento deben estar presentes")
    private CharacteristicDtoEntrance characteristic;

    @Override
    public String getName() {
        return name;
    }
}
