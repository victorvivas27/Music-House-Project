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
 * <p>
 * Utiliza la biblioteca JJWT para crear, firmar y analizar tokens con una clave secreta.
 */
@Service
public class JwtService {

    /**
     * Clave secreta para firmar y verificar los tokens, definida en application.properties o application.yml.
     */
    @Value("${security.jwt.secret-key}")
    private String SECRET_KEY;

    /**
     * Tiempo de expiración del token JWT, expresado en minutos.
     * <p>
     * Este valor se carga desde el archivo de configuración (application.properties o application.yml)
     * utilizando la propiedad: {@code security.jwt.expiration-minutes}.
     * <p>
     * Ejemplo de configuración:
     * <pre>
     * security.jwt.expiration-minutes=60
     * </pre>
     * <p>
     * El valor se convierte internamente a milisegundos para establecer la fecha de expiración del token:
     * {@code TOKEN_EXPIRATION_TIME * 60 * 1000}.
     * <p>
     * Recomendaciones:
     * - Para aplicaciones web: 15 a 60 minutos.
     * - Para apps móviles: hasta 24 horas.
     * - Para microservicios: 5 a 15 minutos (tokens más cortos + refresh token).
     */
    @Value("${security.jwt.expiration-minutes}")
    private long TOKEN_EXPIRATION_TIME;

    /**
     * Genera un token JWT para el usuario autenticado.
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

    /**
     * Genera un token JWT con los claims y sujeto proporcionados.
     *
     * @param extraClaims Claims adicionales que se incluirán en el payload del token.
     * @param subject     Identificador principal del token (generalmente el ID del usuario).
     * @return Token JWT generado.
     */
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
     * Extrae todos los claims (reclamos) del token JWT.
     *
     * @param token Token JWT del cual extraer la información.
     * @return Claims extraídos del token.
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token).getBody();
    }

    /**
     * Obtiene la clave secreta como un objeto {@link Key} utilizando el algoritmo HS256.
     *
     * @return Clave para firmar/verificar tokens.
     */
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Obtiene el identificador (subject) del token, que normalmente representa el ID del usuario.
     *
     * @param token Token JWT.
     * @return El subject del token.
     */
    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    /**
     * Valida si un token JWT es válido para el usuario proporcionado.
     *
     * @param token       Token JWT.
     * @param userDetails Detalles del usuario autenticado.
     * @return true si el token es válido; false si es inválido o expirado.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        @SuppressWarnings("unchecked") final List<String> roles =
                getClaim(token, claims -> claims.get("roles", List.class));
        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token)
                && roles != null
                && !roles.isEmpty();
    }

    /**
     * Extrae todos los claims de un token.
     *
     * @param token Token JWT.
     * @return Claims del token.
     */
    private Claims getAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Obtiene un claim específico del token, utilizando una función lambda para definir qué claim extraer.
     *
     * @param token          Token JWT.
     * @param claimsResolver Función que indica qué claim obtener.
     * @param <T>            Tipo del dato a extraer.
     * @return Valor del claim.
     */
    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Obtiene la fecha de expiración del token.
     *
     * @param token Token JWT.
     * @return Fecha de expiración.
     */
    private Date getExpiration(String token) {
        return getClaim(token, Claims::getExpiration);
    }

    /**
     * Verifica si el token ha expirado.
     *
     * @param token Token JWT.
     * @return true si el token ya no es válido por expiración; false si aún es válido.
     */
    private boolean isTokenExpired(String token) {
        return getExpiration(token).before(new Date());
    }
}
