package com.musichouse.api.music.security;

import com.musichouse.api.music.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Servicio para la generación y validación de tokens JWT.
 */
@Service
public class JwtService {
    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;
    @Value("${security.jwt.expiration-minutes}")
    private long TOKEN_EXPIRATION_TIME;

    /**
     * Genera un token JWT para el usuario proporcionado.
     *
     * @param userDetails Detalles del usuario autenticado.
     * @return Token JWT generado.
     */
    public String generateToken(UserDetails userDetails) {
        User user = (User) userDetails;
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList());

        JwtClaims jwtClaims = JwtClaims.builder()
                .id(user.getIdUser().toString())
                .roles(roles)
                .name(user.getName())
                .lastName(user.getLastName())
                .build();

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", jwtClaims.getId());
        claims.put("roles", jwtClaims.getRoles());
        claims.put("email", user.getEmail());
        claims.put("name", jwtClaims.getName());
        claims.put("lastName", jwtClaims.getLastName());

        return generateToken(claims, user.getIdUser().toString());
    }

    private String generateToken(Map<String, Object> extraClaims, String subject) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + TOKEN_EXPIRATION_TIME * 60 * 1000);
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extrae los reclamos (claims) de un token JWT.
     *
     * @param token Token JWT del cual extraer los reclamos.
     * @return Objeto Claims que contiene los reclamos del token.
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Obtiene el nombre de usuario desde un token JWT.
     *
     * @param token Token JWT del cual extraer el nombre de usuario.
     * @return Nombre de usuario extraído del token.
     */

    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    /**
     * Verifica si un token JWT es válido para el usuario proporcionado.
     *
     * @param token       Token JWT a verificar.
     * @param userDetails Detalles del usuario para la verificación.
     * @return true si el token es válido, false en caso contrario.
     */

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        @SuppressWarnings("unchecked") final List<String> roles = getClaim(token, claims -> claims.get("roles", List.class));
        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && roles != null
                && !roles.isEmpty();
    }

    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
}
