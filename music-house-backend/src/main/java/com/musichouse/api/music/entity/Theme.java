package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
     * URL de la imagen principal asociada a esta temática.
     */
    private String imageUrlTheme;

    /**
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar la entidad en la base de datos.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;

    /**
     * Anotación que marca el campo como una fecha de modificación automática.
     * Hibernate asigna automáticamente la fecha y hora actual cada vez que
     * la entidad es actualizada en la base de datos.
     */
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;


    /**
     * Método que normaliza el nombre de la tematica antes de guardar o actualizar la entidad.
     * <p>
     * Se eliminan espacios duplicados, se recortan los espacios en blanco al inicio y al final,
     * y se convierte el texto a mayúsculas para mantener consistencia en la base de datos.
     * <p>
     * Este método se ejecuta automáticamente antes de las operaciones de persistencia
     * (@PrePersist) y actualización (@PreUpdate) gracias al ciclo de vida de JPA.
     */
    @PrePersist
    @PreUpdate
    private void normalizeData() {
        if (this.themeName != null) this.themeName = this.themeName
                .replaceAll("\\s+", " ")
                .trim()
                .toUpperCase();

    }
}
