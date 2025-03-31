package com.musichouse.api.music.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
    @Column(name = "id_theme", updatable = false, nullable = false)
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
     * Lista de URLs de imágenes asociadas con una tematica.
     */
    @OneToMany(
            mappedBy = "theme",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    @JsonIgnore
    private List<ImageUrls> imageUrls = new ArrayList<>();

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
