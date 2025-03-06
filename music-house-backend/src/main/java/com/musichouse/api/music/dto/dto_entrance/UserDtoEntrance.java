package com.musichouse.api.music.dto.dto_entrance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.URL;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoEntrance {

    @NotNull(message = "Debes volocar un imagen de perfil")
    @Size(min = 1, max = 2048, message = "La imagen de perfil debe tener entre 1 y 2048 caracteres")
    @URL(message = "La imagen de perfil debe ser una URL válida")
    private String picture;

    @NotNull(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "El nombre solo debe contener letras, acentos y espacios")
    private String name;

    @NotNull(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$", message = "El apellido solo debe contener letras, acentos y espacios")
    private String lastName;

    @NotNull(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotNull(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 30, message = "La contraseña debe tener entre 6 y 30 caracteres")
    @Pattern(regexp = ".*[A-Z].*", message = "La contraseña debe contener al menos una letra mayúscula")
    @Pattern(regexp = ".*[a-z].*", message = "La contraseña debe contener al menos una letra minúscula")
    @Pattern(regexp = ".*\\d.*", message = "La contraseña debe contener al menos un número")
    @Pattern(regexp = ".*[@#$%^&+=!*].*", message = "La contraseña debe contener al menos un carácter especial (@, #, $, etc.)")
    private String password;

    @NotNull(message = "El campo addresses debe estar presente y no puede estar vacío")
    @Valid
    private List<AddressDtoEntrance> addresses;

    @Valid
    @NotNull(message = "El campo phones debe estar presente y no puede estar vacío")
    private List<PhoneDtoEntrance> phones;

    @NotNull(message = "El campo telegram id  debe estar presente y no puede estar vacío")
    private Long telegramChatId;
}
