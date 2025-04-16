package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa una fecha disponible para un instrumento.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AVAILABLE_DATES")
public class AvailableDate {
    /**
     * Identificador único de la fecha disponible.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idAvailableDate;

    /**
     * La fecha para la cual el instrumento está disponible.
     */
    @Column(nullable = false, name = "date_available")
    private LocalDate dateAvailable;

    /**
     * Indica si el instrumento está disponible en la fecha especificada.
     */
    @Column(nullable = false)
    private Boolean available;

    /**
     * El instrumento asociado con esta fecha disponible.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_instrument")

    private Instrument instrument;

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
}
