package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImagesUrlsDtoExit {

    private UUID idImage;

    private UUID idInstrument;

    private UUID idTheme;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String imageUrl;
}
