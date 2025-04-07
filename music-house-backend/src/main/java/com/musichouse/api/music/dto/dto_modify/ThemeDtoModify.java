package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ThemeDtoModify {

    @NotNull(message = "El idTheme  es obligatorio")
    private UUID idTheme;

    @NotBlank(message = "El nombre de la tematica es obligatorio")
    @Size(max = 100, message = "El nombre de la tematica debe tener como máximo {max} caracteres")
    private String themeName;

    @Size(max = 1024, message = "La descripción de la tematica debe tener como máximo {max} caracteres")
    private String description;

    @Valid
    @NotBlank(message = "La imagen es obligatoria")
    private List<String> imageUrls;
}
