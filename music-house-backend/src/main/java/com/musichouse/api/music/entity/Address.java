package com.musichouse.api.music.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.UUID;

/**
 * Representa una dirección en la aplicación de Music House.
 */
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ADDRESSES")

/**
 * La anotación @EqualsAndHashCode(exclude = {"user"})
 * se utiliza para indicar que, al calcular el hashCode y determinar
 * la igualdad de objetos (equals),
 * se debe excluir el campo "user".
 * Esto se hace para evitar problemas de recursión
 * infinita en las operaciones de igualdad y hashCode.
 */


public class Address {
    /**
     * Identificador único para la dirección.
     */
    @Id
    @GeneratedValue(generator = "UUID")
    private UUID idAddress;

    /**
     * La calle de la dirección.
     */
    @Column(length = 100, nullable = false)
    private String street;

    /**
     * El número de la dirección.
     */
    @Column(length = 100, nullable = false)
    private Long number;

    /**
     * La ciudad de la dirección.
     */
    @Column(length = 100, nullable = false)
    private String city;

    /**
     * El estado de la dirección.
     */
    @Column(length = 100, nullable = false)
    private String state;

    /**
     * El país de la dirección.
     */
    @Column(length = 100, nullable = false)
    private String country;

    /**
     * El usuario al que pertenece esta dirección.
     *
     * @ManyToOne: Indica una relación muchos a uno entre la clase Address y User.
     * Esto significa que múltiples direcciones pueden pertenecer a un solo usuario.
     * @JoinColumn(name = "user_id"): Especifica la columna en la tabla
     * ADDRESS que actúa como clave externa para
     * la relación con la tabla USERS (donde se almacenan los usuarios).
     * En este caso, la columna user_id se utiliza
     * para almacenar el identificador único del usuario al que pertenece la dirección.
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /**
     * Anotación que marca el campo como una fecha de creación automática.
     * Hibernate asigna automáticamente la fecha y hora actual al insertar
     * la entidad en la base de datos.
     */
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    private Date registDate;

    // 📌 Normalizar a mayúsculas antes de guardar o actualizar
    @PrePersist
    @PreUpdate
    private void normalizeData() {
        if (this.street != null) {
            this.street = this.street.replaceAll("\\s+", " ").trim().toUpperCase();
        }

        if (this.city != null) {
            this.city = this.city.replaceAll("\\s+", " ").trim().toUpperCase();
        }
        if (this.state != null) {
            this.state = this.state.replaceAll("\\s+", " ").trim().toUpperCase();
        }
        if (this.country != null) {
            this.country = this.country.replaceAll("\\s+", " ").trim().toUpperCase();
        }

    }
}


