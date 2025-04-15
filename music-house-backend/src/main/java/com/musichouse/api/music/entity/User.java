package com.musichouse.api.music.entity;

import com.musichouse.api.music.abstracts.Person;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Representa una entidad de usuario en la aplicación de Music House.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "USERS")

public class User extends Person implements UserDetails {

    /**
     * Identificador único para el usuario.
     */
    @Id
    @Column(name = "id_user", updatable = false, nullable = false)
    private UUID idUser;


    /**
     * La contraseña del usuario (almacenada de forma segura y encriptada).
     */
    @Column(nullable = false, length = 100)
    private String password;


    /**
     * La imagen de perfil del usuario.
     */

    @Column(nullable = false, length = 2048)
    private String picture;


    /**
     * Las direcciones del usuario.
     * <p>
     * La propiedad orphanRemoval = true indica que cuando se elimina una dirección del usuario,
     * también se elimina de la base de datos de forma automática para mantener
     * la integridad referencial.
     */
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private Set<Address> addresses;


    /**
     * Los números de teléfono del usuario.
     * <p>
     * La propiedad orphanRemoval = true indica que cuando se elimina un número
     * de teléfono del usuario,
     * también se elimina de la base de datos de forma automática para mantener
     * la integridad referencial.
     */
    @OneToMany(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private Set<Phone> phones;


    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<Roles> roles = new HashSet<>();


    /**
     * Identificador único de Telegram del usuario.
     */
    @Column(name = "chat_id", nullable = true)
    private Long telegramChatId;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
