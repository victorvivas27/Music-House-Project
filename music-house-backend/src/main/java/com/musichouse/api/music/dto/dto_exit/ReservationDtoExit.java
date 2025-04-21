package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDtoExit {

    private UUID idReservation;

    private UUID idUser;

    private UUID idInstrument;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal totalPrice;

    private String name;

    private String lastName;

    private String email;

    private String city;

    private String country;

    private String instrumentName;


    private String imageUrl;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime registDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "America/Santiago")
    private LocalDateTime modifiedDate;
}
