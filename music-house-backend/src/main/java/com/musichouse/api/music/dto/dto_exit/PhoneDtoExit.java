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
public class PhoneDtoExit {

    private UUID idPhone;

    private UUID idUser;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String phoneNumber;
}
