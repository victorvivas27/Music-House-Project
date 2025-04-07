package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Theme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio para acceder y gestionar entidades {@link Theme} desde la base de datos.
 * <p>
 * Extiende de {@link JpaRepository}, lo que proporciona operaciones CRUD básicas y soporte
 * para paginación y ordenamiento.
 * <p>
 * Este repositorio utiliza **consultas derivadas por nombre de método (Query Methods)**,
 * una técnica de Spring Data JPA que permite generar consultas automáticamente a partir del
 * nombre del método siguiendo una convención.
 */
@Repository
public interface ThemeRepository extends JpaRepository<Theme, UUID> {

    /**
     * Busca una página de tematicas cuyo nombre contenga el texto especificado (ignorando mayúsculas/minúsculas).
     *
     * @param themeName Parte del nombre de la thematica a buscar.
     * @param pageable  Objeto que define la paginación y ordenamiento.
     * @return Una página de tematicas que coincidan con el criterio de búsqueda.
     */

    Page<Theme> findByThemeNameContainingIgnoreCase(String themeName, Pageable pageable);

    /**
     * Busca una tematica por su nombre exacto, ignorando mayúsculas/minúsculas.
     *
     * @param themeName El nombre exacto de la tematica.
     * @return Un Optional que contiene la tematica encontrada si existe.
     */

    Optional<Theme> findByThemeNameIgnoreCase(String themeName);
}
