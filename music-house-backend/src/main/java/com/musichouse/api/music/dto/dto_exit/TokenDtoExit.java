package com.musichouse.api.music.dto.dto_exit;

import com.musichouse.api.music.entity.Role;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenDtoExit {

    private UUID idUser;

    private String picture;

    private String name;

    private String lastName;

    private List<Role> roles;

    private String token;

    @Builder.Default
    private String tokenType = "Bearer ";

    public TokenDtoExit(UUID idUser,String picture, String name, String lastName, List<Role> roles, String token) {
        this.idUser = idUser;
        this.picture = picture;
        this.name = name;
        this.lastName = lastName;
        this.roles = roles;
        this.token = token;
        this.tokenType = "Bearer ";
    }
}