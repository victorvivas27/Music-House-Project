package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryDtoModify {

    @NotNull(message = "El idCategory  es obligatorio")
    private UUID idCategory;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(max = 100, message = "El nombre de la categoría debe tener como máximo {max} caracteres")
    private String categoryName;

    @Size(max = 1024, message = "La descripción de la categoría debe tener como máximo {max} caracteres")
    @NotBlank(message = "La descripción de la categoría es obligatoria")
    private String description;
}
