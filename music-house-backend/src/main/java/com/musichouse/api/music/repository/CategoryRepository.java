package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repositorio para acceder y gestionar entidades {@link Category} desde la base de datos.
 * <p>
 * Extiende de {@link JpaRepository}, lo que proporciona operaciones CRUD básicas y soporte
 * para paginación y ordenamiento.
 * <p>
 * Este repositorio utiliza **consultas derivadas por nombre de método (Query Methods)**,
 * una técnica de Spring Data JPA que permite generar consultas automáticamente a partir del
 * nombre del método siguiendo una convención.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    /**
     * Busca una página de categorías cuyo nombre contenga el texto especificado (ignorando mayúsculas/minúsculas).
     *
     * @param categoryName Parte del nombre de la categoría a buscar.
     * @param pageable     Objeto que define la paginación y ordenamiento.
     * @return Una página de categorías que coincidan con el criterio de búsqueda.
     */
    Page<Category> findByCategoryNameContainingIgnoreCase(String categoryName, Pageable pageable);

    /**
     * Busca una categoría por su nombre exacto, ignorando mayúsculas/minúsculas.
     *
     * @param categoryName El nombre exacto de la categoría.
     * @return Un Optional que contiene la categoría encontrada si existe.
     */
    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);
}
