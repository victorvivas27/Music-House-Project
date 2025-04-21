package com.musichouse.api.music.abstracts;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public abstract class Person {

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
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar la entidad en la base de datos.
     */
    @CreationTimestamp
    @Column(name = "regist_date", nullable = false, updatable = false)
    private LocalDateTime registDate;


    /**
     * Anotación que marca el campo como una fecha de modificación automática.
     * Hibernate asigna automáticamente la fecha y hora actual cada vez que
     * la entidad es actualizada en la base de datos.
     */
    @UpdateTimestamp
    @Column(name = "modified_date", nullable = false)
    private LocalDateTime modifiedDate;

    @PrePersist
    @PreUpdate
    protected void normalizeData() {
        if (this.name != null) {
            this.name = this.name.replaceAll("\\s+", " ").trim().toUpperCase();
        }
        if (this.lastName != null) {
            this.lastName = this.lastName.replaceAll("\\s+", " ").trim().toUpperCase();
        }
    }
}