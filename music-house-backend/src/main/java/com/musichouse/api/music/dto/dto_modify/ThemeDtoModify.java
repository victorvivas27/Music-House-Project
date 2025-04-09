package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.musichouse.api.music.interfaces.HasThemeName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ThemeDtoModify implements HasThemeName {

    @NotNull(message = "El idTheme  es obligatorio")
    private UUID idTheme;

    @NotBlank(message = "El nombre de la tematica es obligatorio")
    @Size(max = 100, message = "El nombre de la tematica debe tener como máximo {max} caracteres")
    private String themeName;

    @NotBlank(message = "La descripcion de la tematica es obligatorio")
    @Size(max = 1024, message = "La descripción de la tematica debe tener como máximo {max} caracteres")
    private String description;

    private String imageUrlTheme;

    @Override
    public String getThemeName() {
        return themeName;
    }
}
