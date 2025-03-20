package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
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
/**
 * La anotación @EqualsAndHashCode(exclude = {"addresses", "phones", "roles"})
 * se utiliza para indicar que,
 * al calcular el hashCode y determinar la igualdad de objetos (equals),
 * se deben excluir los campos addresses,
 * phones y roles.
 * Esto se hace para evitar problemas de recursión infinita en las
 * operaciones de igualdad y hashCode.
 */
@EqualsAndHashCode(exclude = {"addresses", "phones", "roles"})
public class User implements UserDetails {

    /**
     * Identificador único para el usuario.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idUser;

    /**
     * La imagen de perfil del usuario.
     */

    @Column(nullable = false, length = 2048)
    private String picture;

    /**
     * El nombre del usuario.
     */
    @Column(nullable = false, length = 100)
    private String name;

    /**
     * El apellido del usuario.
     */
    @Column(nullable = false, length = 100)
    private String lastName;

    /**
     * El correo electrónico del usuario (usado para inicio de sesión y notificaciones).
     * <p>
     * Debe ser único en la base de datos para evitar duplicados.
     */
    @Column(nullable = false, length = 100, unique = true)
    private String email;

    /**
     * La contraseña del usuario (almacenada de forma segura y encriptada).
     */
    @Column(nullable = false, length = 100)
    private String password;

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

    /**
     * Roles asignados al usuario.
     *
     * @ManyToMany: Relación muchos a muchos entre User y Role.
     * Un usuario puede tener varios roles y viceversa.
     * @JoinTable: Tabla de unión para la relación, define las columnas user_id y rol_id.
     * <p>
     * fetch = FetchType.EAGER: Carga ansiosa de roles al cargar un usuario.
     * <p>
     * cascade = CascadeType.ALL: Operaciones en cascada para roles asociados
     * (guardar, actualizar, eliminar).
     */
    @ManyToMany(
            fetch = FetchType.EAGER,
            targetEntity = Role.class,
            cascade = CascadeType.ALL
    )
    @JoinTable(
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Role> roles;

    /**
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar
     * la entidad en la base de datos.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;

    /**
     * Identificador único de Telegram del usuario.
     */
    @Column(name = "chat_id", nullable = true)
    private Long telegramChatId;


    // 📌 Normalizar a mayúsculas y eliminar espacios extra antes de guardar o actualizar
    @PrePersist
    @PreUpdate
    private void normalizeData() {
        if (this.name != null) {
            this.name = this.name.replaceAll("\\s+", " ").trim().toUpperCase();
        }
        if (this.lastName != null) {
            this.lastName = this.lastName.replaceAll("\\s+", " ").trim().toUpperCase();
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles
                .stream().map(role -> new SimpleGrantedAuthority(role.getRol()))
                .collect(Collectors.toSet());
    }

    @Override
    public String getUsername() {
        return email;
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
