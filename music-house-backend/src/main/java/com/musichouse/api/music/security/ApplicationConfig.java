package com.musichouse.api.music.security;

import com.musichouse.api.music.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Clase de configuración de la aplicación para la seguridad.
 */
@Configuration // Define esta clase como una configuración de Spring
@RequiredArgsConstructor // Genera automáticamente un constructor con los campos final
public class ApplicationConfig {
    // Campo final que se inyecta automáticamente
    private final UserRepository userRepository;

    /**
     * Bean para obtener el AuthenticationManager configurado.
     *
     * @param configuration Configuración de autenticación
     * @return AuthenticationManager configurado
     * @throws Exception Si hay algún error al obtener el AuthenticationManager
     */
    @Bean // Define un bean de AuthenticationManager
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        // Devuelve el AuthenticationManager configurado
        return configuration.getAuthenticationManager();
    }

    /**
     * Bean para configurar el AuthenticationProvider.
     *
     * @return AuthenticationProvider configurado
     */
    @Bean // Define un bean de AuthenticationProvider
    public AuthenticationProvider authenticationProvider() {
        // Crea un proveedor de autenticación
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        // Configura el servicio de detalles de usuario
        authenticationProvider.setUserDetailsService(userDetailService());
        // Configura el codificador de contraseñas
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        // Devuelve el proveedor de autenticación configurado
        return authenticationProvider;
    }

    /**
     * Bean para obtener el PasswordEncoder.
     *
     * @return PasswordEncoder
     */
    @Bean // Define un bean de PasswordEncoder
    public PasswordEncoder passwordEncoder() {
        // Devuelve un codificador de contraseñas BCrypt
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean para obtener el UserDetailsService y buscar usuarios por nombre de usuario.
     *
     * @return UserDetailsService configurado
     */
    @Bean // Define un bean de UserDetailsService
    public UserDetailsService userDetailService() {
        // Busca un usuario por nombre de usuario
        return username -> userRepository.findByEmail(username)
                // Lanza una excepción si no se encuentra el usuario
                .orElseThrow(() -> new UsernameNotFoundException("Usuario not found"));
    }


}