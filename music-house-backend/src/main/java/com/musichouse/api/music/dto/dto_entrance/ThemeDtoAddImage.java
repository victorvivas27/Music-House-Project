package com.musichouse.api.music.dto.dto_entrance;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ThemeDtoAddImage {

    @NotNull(message = "El idTheme es obligatorio")
    private UUID idTheme;

}
