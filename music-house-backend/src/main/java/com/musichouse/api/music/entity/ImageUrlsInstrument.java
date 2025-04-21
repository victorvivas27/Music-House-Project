package com.musichouse.api.music.entity;

import com.musichouse.api.music.abstracts.ImageUrl;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;


/**
 * Entidad que representa las URLs de las imágenes asociadas a un instrumento.
 */
@Entity
@Getter
@Setter
@SuperBuilder
@Table(name = "IMAGE_URLS_INSTRUMENTS")
@AllArgsConstructor
@NoArgsConstructor
public class ImageUrlsInstrument extends ImageUrl {

    /**
     * Identificador único de la imagen.
     */
    @Id
    @GeneratedValue(generator = "UUID")

    private UUID idImage;

    /**
     * Instrumento al que pertenece la imagen.
     * Esta relación es ManyToOne, lo que significa que muchas imágenes pueden
     * pertenecer a un solo instrumento.
     * FetchType.EAGER indica que la carga de la entidad Instrument
     * se realiza de forma inmediata junto con la carga de ImageUrl.
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_instrument")

    private Instrument instrument;


}
