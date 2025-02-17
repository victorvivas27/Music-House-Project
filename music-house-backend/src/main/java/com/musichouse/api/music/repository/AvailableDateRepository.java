package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.AvailableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvailableDateRepository extends JpaRepository<AvailableDate, UUID> {
    @Modifying
    @Transactional
    @Query("DELETE FROM AvailableDate a WHERE a.instrument.idInstrument = :idInstrument AND a.idAvailableDate = :idAvailableDate")
    void deleteByIdInstrumentAndIdAvailableDate(UUID idInstrument, UUID idAvailableDate);

    /**
     * @Query("SELECT a FROM AvailableDate a WHERE a.dateAvailable = :dateAvailable AND a.available = TRUE")
     */
    List<AvailableDate> findByDateAvailableAndAvailableIsTrue(LocalDate dateAvailable);

    /**
     * @Query("SELECT a FROM AvailableDate a WHERE a.instrument.idInstrument = :instrumentId AND a.dateAvailable = :dateAvailable")
     */
    Optional<AvailableDate> findByInstrumentIdInstrumentAndDateAvailable(UUID instrumentId, LocalDate dateAvailable);

    /**
     * @Query("SELECT a FROM AvailableDate a WHERE a.dateAvailable BETWEEN :startDate AND :endDate")
     */
    List<AvailableDate> findByDateAvailableBetween(LocalDate startDate, LocalDate endDate);

    /**
     * @Query("SELECT a FROM AvailableDate a WHERE a.instrument.idInstrument = :idInstrument AND a.dateAvailable BETWEEN :startDate AND :endDate")
     */
    List<AvailableDate> findByInstrumentIdInstrumentAndDateAvailableBetween(UUID idInstrument, LocalDate startDate, LocalDate endDate);

    // Agrega este método personalizado para encontrar fechas disponibles por ID de instrumento
    List<AvailableDate> findByInstrumentIdInstrument(UUID idInstrument);

    boolean existsByInstrumentIdInstrumentAndAvailableFalse(UUID instrumentId);

    /**
     * Elimina todas las entidades AvailableDate cuya fechaAvailable sea anterior a la fecha especificada.
     *
     * <p>Este método está anotado con {@link Modifying} y {@link Transactional} para asegurar que realiza
     * una operación de modificación dentro de un contexto transaccional. La anotación {@link Query} especifica
     * la consulta JPQL (Java Persistence Query Language) a ejecutar.</p>
     *
     * @param today la fecha con la cual se comparará el campo fechaAvailable.
     *              Se eliminarán todos los registros con una fechaAvailable anterior a esta fecha.
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM AvailableDate a WHERE a.dateAvailable < :today")
    void deleteByDateAvailableBefore(LocalDate today);

}
