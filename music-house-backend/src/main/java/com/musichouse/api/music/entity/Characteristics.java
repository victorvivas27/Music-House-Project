package com.musichouse.api.music.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Representa las características generales de un instrumento musical.
 */
@Entity
@Getter
@Setter
@Builder
@Table(name = "CHARACTERISTICS")
@AllArgsConstructor
@NoArgsConstructor
public class Characteristics {
    /**
     * Identificador único para las características del instrumento.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "id_characteristics")
    private UUID idCharacteristics;

    /**
     * Si lleva estuche.
     */
    @Column(length = 50, nullable = false)
    private String instrumentCase;

    /**
     * Si lleva soporte.
     */
    @Column(length = 50, nullable = false)
    private String support;

    /**
     * Si lleva afinador.
     */
    @Column(name = "tuner", length = 50, nullable = false)
    private String tuner;

    /**
     * Si lleva micrófono.
     */
    @Column(length = 50, nullable = false)
    private String microphone;

    /**
     * Si lleva soporte para teléfono.
     */
    @Column(length = 50, nullable = false)
    private String phoneHolder;

}