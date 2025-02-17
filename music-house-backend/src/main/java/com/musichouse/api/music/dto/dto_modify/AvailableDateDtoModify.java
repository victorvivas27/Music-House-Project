package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class AvailableDateDtoModify {

    @NotNull(message = "El id de fecha disponible no puede ser nulo")
    private UUID idAvailableDate;

    @FutureOrPresent(message = "La fecha no puede ser anterior al dia de hoy")
    @NotNull(message = "Fecha disponible no puede ser nula")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateAvailable;

    @NotNull(message = "El id del instrumento es obligatorio")
    private UUID idInstrument;

    @NotNull(message = "Disponible no puede ser nulo")
    private Boolean available;
}
