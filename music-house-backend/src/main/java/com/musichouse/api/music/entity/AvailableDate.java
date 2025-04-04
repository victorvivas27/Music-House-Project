package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;
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
     * La fecha en la que se registró este registro de fecha disponible.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    @Column(name = "regist_date")
    private Date registDate;
}
