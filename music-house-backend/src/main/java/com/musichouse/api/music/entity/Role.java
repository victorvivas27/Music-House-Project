package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

/**
 * Representa un rol en la aplicación de Music House.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ROLES")
public class Role {
    /**
     * Identificador único para el rol.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idRol;

    /**
     * El nombre del rol.
     */
    @Column(nullable = false, unique = true)
    private String rol;

    /**
     * La fecha en que se registró el rol.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;

    /**
     * Constructor para crear un rol con un nombre específico.
     *
     * @param rol El nombre del rol.
     */
    public Role(String rol) {
        this.rol = rol;
    }
}