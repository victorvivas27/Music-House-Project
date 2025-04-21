package com.musichouse.api.music.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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
