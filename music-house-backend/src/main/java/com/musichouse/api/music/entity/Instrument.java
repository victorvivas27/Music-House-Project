package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Representa un instrumento musical disponible para alquiler.
 */
@Entity
@Getter
@Setter
@Builder
@Table(name = "INSTRUMENTS")
@AllArgsConstructor
@NoArgsConstructor
public class Instrument {
    /**
     * Identificador único del instrumento.
     */
    @Id
    @Column(name = "id_instrument", updatable = false, nullable = false)
    private UUID idInstrument;

    /**
     * Nombre del instrumento.
     */
    @Column(length = 100, unique = true)
    private String name;

    /**
     * Descripción detallada del instrumento.
     */
    @Column(length = 1024)
    private String description;

    /**
     * Peso del instrumento en kilogramos.
     * Precision: 10 dígitos.
     * Escala: 2 decimales.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weight;

    /**
     * Altura del instrumento en centímetros.
     */
    @Column(nullable = false, length = 100)
    private String measures;

    /**
     * Precio de alquiler del instrumento.
     * Precision: 10 dígitos.
     * Escala: 2 decimales.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal rentalPrice;

    /**
     * Categoría a la que pertenece el instrumento.
     */
    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    /**
     * Tematica  a la que pertenece el instrumento.
     */
    @ManyToOne
    @JoinColumn(name = "id_theme")
    private Theme theme;

    /**
     * Lista de URLs de imágenes asociadas al instrumento.
     */
    @OneToMany(
            mappedBy = "instrument",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<ImageUrls> imageUrls = new ArrayList<>();

    /**
     * Características del instrumento.
     */
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "characteristics_id",
            referencedColumnName = "id_characteristics")
    private Characteristics characteristics;

    /**
     * Lista de fechas y horas disponibles para alquilar el instrumento.
     */

    @OneToMany(
            mappedBy = "instrument",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER
    )
    private List<AvailableDate> availableDates;

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

    /**
     * Normalizar a mayúsculas y eliminar espacios extra antes de guardar o actualizar
     */

    @PrePersist
    @PreUpdate
    private void normalizeData() {
        if (this.name != null) {
            this.name = this.name
                    .replaceAll("\\s+", " ")
                    .trim()
                    .toUpperCase();
        }

    }
}
