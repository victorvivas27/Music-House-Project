package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.musichouse.api.music.interfaces.HasName;
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
public class CategoryDtoModify implements HasName {

    @NotNull(message = "El idCategory  es obligatorio")
    private UUID idCategory;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(max = 100, message = "El nombre de la categoría debe tener como máximo {max} caracteres")
    private String categoryName;

    @Size(max = 1024, message = "La descripción de la categoría debe tener como máximo {max} caracteres")
    @NotBlank(message = "La descripción de la categoría es obligatoria")
    private String description;

    @Override
    public String getName() {
        return categoryName;
    }
}
