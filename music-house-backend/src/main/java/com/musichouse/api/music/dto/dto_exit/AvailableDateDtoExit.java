package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AvailableDateDtoExit {

    private UUID idAvailableDate;

    private UUID idInstrument;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private LocalDate dateAvailable;

    private Boolean available;
}
