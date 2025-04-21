package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa una reserva de un instrumento en Music House.
 * Esta entidad se mapea a la tabla "RESERVATIONS" en la base de datos.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "RESERVATIONS")
public class Reservation {

    /**
     * El identificador único para la reserva.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idReservation;

    /**
     * El usuario que hizo la reserva.
     * Este campo se ignora durante la serialización JSON.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user")

    private User user;

    /**
     * El instrumento que ha sido reservado.
     * Este campo se ignora durante la serialización JSON.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_instrument")

    private Instrument instrument;

    /**
     * La fecha de inicio de la reserva.
     */
    @Column(nullable = false)
    private LocalDate startDate;

    /**
     * La fecha de fin de la reserva.
     */
    @Column(nullable = false)
    private LocalDate endDate;

    /**
     * El precio total del alquiler.
     */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

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
