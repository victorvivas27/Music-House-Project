package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChangeOfRole {

    @NotNull(message = "El idUser es obligatorio")
    private UUID idUser;

    @NotNull(message = "El rol es obligatorio")
    private String rol;
}
