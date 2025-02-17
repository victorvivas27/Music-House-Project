package com.musichouse.api.music.dto.dto_modify;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PrivacyPolicyDtoModify {

    @NotNull(message = "El id de la politica de privacidad deve estar presente ")
    private UUID idPrivacyPolicy;

    @NotNull(message = "El titulo de la politica de privacidad deve estar presente ")
    private String title;

    @NotNull(message = "El contenido de la politica de privacidad deve estar presente ")
    private String content;
}
