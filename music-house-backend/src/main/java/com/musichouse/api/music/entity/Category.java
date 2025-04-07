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
@Table(name = "CATEGORIES")
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    /**
     * Identificador único de la categoría.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idCategory;

    /**
     * Nombre de la categoría.
     */
    @Column(length = 100, unique = true)
    private String categoryName;

    /**
     * Descripción de la categoría.
     */
    @Column(length = 1024)
    private String description;

    /**
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar
     * la entidad en la base de datos.
     */
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
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
     * Método que normaliza el nombre de la categoría antes de guardar o actualizar la entidad.
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
        if (this.categoryName != null) {
            this.categoryName = this.categoryName
                    .replaceAll("\\s+", " ")
                    .trim()
                    .toUpperCase();

        }
    }
}
