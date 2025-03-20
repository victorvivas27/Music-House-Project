package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@Table(name = "THEMES")
@AllArgsConstructor
@NoArgsConstructor
public class Theme {
    /**
     * Identificador único de la temeatica.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idTheme;

    /**
     * Nombre de la tematica.
     */
    @Column(length = 100, unique = true)
    private String themeName;

    /**
     * Descripción de la tematica.
     */
    @Column(length = 1024)
    private String description;

    /**
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar la entidad en la base de datos.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;

    // 📌 Normalizar a mayúsculas antes de guardar o actualizar
    @PrePersist
    @PreUpdate
    private void normalizeData() {
        if (this.themeName != null) this.themeName = this.themeName.toUpperCase();

    }
}
