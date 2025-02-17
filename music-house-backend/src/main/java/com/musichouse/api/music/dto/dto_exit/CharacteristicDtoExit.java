package com.musichouse.api.music.dto.dto_exit;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CharacteristicDtoExit {

    private UUID idCharacteristics;

    private String instrumentCase;

    private String support;

    private String tuner;

    private String microphone;

    private String phoneHolder;
}
