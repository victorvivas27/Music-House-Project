package com.musichouse.api.music.security;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class JwtClaims {
    private String id;
    private List<String> roles;
    private String name;
    private String lastName;
}
