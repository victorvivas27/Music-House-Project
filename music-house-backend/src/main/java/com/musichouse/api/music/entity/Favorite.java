package com.musichouse.api.music.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

/**
 * Representa un elemento favorito en la aplicación de música.
 * Almacena información sobre si un instrumento ha sido marcado como favorito por un usuario.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "FAVORITES")
public class Favorite {
    /**
     * El identificador único para el elemento favorito.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idFavorite;

    /**
     * Indica si el instrumento ha sido marcado como favorito.
     */
    private Boolean isFavorite;

    /**
     * El instrumento asociado con este elemento favorito.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_instrument")
    @JsonIgnoreProperties("favorites")
    private Instrument instrument;

    /**
     * El usuario que marcó el instrumento como favorito.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_user")
    @JsonIgnoreProperties("favorites")
    private User user;

    /**
     * La fecha y hora en que se registró este elemento favorito.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;
}
