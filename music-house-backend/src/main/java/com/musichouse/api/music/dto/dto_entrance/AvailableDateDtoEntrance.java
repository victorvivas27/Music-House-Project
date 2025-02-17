package com.musichouse.api.music.dto.dto_entrance;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AvailableDateDtoEntrance {

    @NotNull(message = "El id del instrumento es obligatorio")
    private UUID idInstrument;

    @FutureOrPresent(message = "La fecha no puede ser anterior al dia de hoy")
    @NotNull(message = "Fecha disponible no puede ser nula")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAvailable;

    @NotNull(message = "Disponible no puede ser nulo")
    private Boolean available;

}
