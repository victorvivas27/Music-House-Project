package com.musichouse.api.music.dto.dto_entrance;

import com.musichouse.api.music.interfaces.HasName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDtoEntrance implements HasName {

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(max = 100, message = "El nombre de la categoría debe tener como máximo {max} caracteres")
    private String categoryName;

    @NotBlank(message = "La descripcion de la categoria es obligatorio")
    @Size(max = 1024, message = "La descripción de la categoría debe tener como máximo {max} caracteres")
    private String description;

    @Override
    public String getName() {
        return categoryName;
    }
}
