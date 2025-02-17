package com.musichouse.api.music.security;

import com.musichouse.api.music.dto.dto_entrance.LoginDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.TokenDtoExit;
import com.musichouse.api.music.exception.UnauthorizedException;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.util.RoleConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /**
     * Método para realizar el inicio de sesión.
     *
     * @param loginDtoEntrada Objeto DTO que contiene las credenciales de inicio de sesión (email y contraseña).
     * @return Objeto DTO que contiene el token generado en caso de inicio de sesión exitoso.
     * @throws AccessDeniedException Si el usuario no tiene los permisos requeridos para iniciar sesión.
     */
    public TokenDtoExit login(LoginDtoEntrance loginDtoEntrance) throws UnauthorizedException {
        // Autenticar las credenciales del usuario
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDtoEntrance.getEmail(),
                loginDtoEntrance.getPassword()));

        // Obtener los detalles del usuario
        UserDetails userDetails = userRepository.findByEmail(loginDtoEntrance.getEmail()).orElseThrow();

        // Verificar si el usuario tiene permisos de ADMIN o USER para generar el token
        if (userDetails.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals(RoleConstants.ADMIN) || a.getAuthority().equals(RoleConstants.USER))) {
            // Generar el token utilizando JwtService
            String token = jwtService.generateToken(userDetails);
            return TokenDtoExit.builder().token(token).build();
        } else {
            // Lanzar excepción si el usuario no tiene permisos suficientes
            throw new UnauthorizedException("No tiene permisos de administrador");
        }
    }
}
