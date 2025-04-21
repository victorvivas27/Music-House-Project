package com.musichouse.api.music.dto.dto_exit;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InstrumentFavoriteDtoExit {

    private UUID idInstrument;

    private String name;

    private String imageUrl;
}
