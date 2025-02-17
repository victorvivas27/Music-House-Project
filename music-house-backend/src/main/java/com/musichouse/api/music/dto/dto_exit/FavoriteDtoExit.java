package com.musichouse.api.music.dto.dto_exit;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.musichouse.api.music.entity.Instrument;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteDtoExit {

    private UUID idFavorite;

    private UUID idUser;

    private Boolean isFavorite;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private Instrument instrument;

    private String imageUrl;

}