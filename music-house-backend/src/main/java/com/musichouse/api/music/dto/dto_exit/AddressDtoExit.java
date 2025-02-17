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
public class AddressDtoExit {

    private UUID idAddress;

    private UUID idUser;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String street;

    private Long number;

    private String city;

    private String state;

    private String country;
}
