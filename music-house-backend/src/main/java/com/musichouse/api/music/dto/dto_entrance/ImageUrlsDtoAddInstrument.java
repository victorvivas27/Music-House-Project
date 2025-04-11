package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImageUrlsDtoAddInstrument {

    @NotNull(message = "El id del instrumento es obligatorio")
    private UUID idInstrument;


    private String imageUrl;

}
