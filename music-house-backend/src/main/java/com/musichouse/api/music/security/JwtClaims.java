package com.musichouse.api.music.security;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@Builder
public class JwtClaims {
    private String id;
    private String email;
    private List<String> roles;
    private String name;
    private String lastName;
}
