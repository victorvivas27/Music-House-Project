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
    @Temporal(TemporalType.DATE)
    private Date registDate;
}
