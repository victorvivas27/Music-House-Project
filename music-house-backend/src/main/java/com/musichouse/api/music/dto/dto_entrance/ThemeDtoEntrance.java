package com.musichouse.api.music.dto.dto_entrance;

import com.musichouse.api.music.interfaces.HasThemeName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ThemeDtoEntrance implements HasThemeName {

    @NotBlank(message = "El nombre de la tematica es obligatorio")
    @Size(max = 100, message = "El nombre de la tematica debe tener como máximo {max} caracteres")
    private String themeName;

    @Size(max = 1024, message = "La descripción de la tematica debe tener como máximo {max} caracteres")
    private String description;


    private List<String> imageUrls;

    @Override
    public String getThemeName() {
        return themeName;
    }
}
