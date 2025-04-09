package com.musichouse.api.music.dto.dto_entrance;

import com.musichouse.api.music.interfaces.HasName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ThemeDtoEntrance implements HasName {

    @NotBlank(message = "El nombre de la tematica es obligatorio")
    @Size(max = 100, message = "El nombre de la tematica debe tener como máximo {max} caracteres")
    private String themeName;

    @NotBlank(message = "La descripcion de la tematica es obligatorio")
    @Size(max = 1024, message = "La descripción de la tematica debe tener como máximo {max} caracteres")
    private String description;


    private String imageUrlTheme;

    @Override
    public String getName() {
        return themeName;
    }
}
