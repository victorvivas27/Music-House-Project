package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Theme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    /**
     * Encuentra una lista de instrumentos que pertenecen a una categoría específica.
     *
     * @param category la categoría de los instrumentos que se desea encontrar.
     * @return una lista de instrumentos que pertenecen a la categoría especificada.
     * <p>
     * Ejemplo en la base de datos:
     * Si tienes una categoría con el nombre "Cuerdas", la consulta JPQL sería:
     * SELECT i FROM Instrument i WHERE i.category = :category
     */
    List<Instrument> findByCategory(Category category);

    /**
     * Encuentra una lista de instrumentos que pertenecen a un tema específico.
     *
     * @param theme el tema de los instrumentos que se desea encontrar.
     * @return una lista de instrumentos que pertenecen al tema especificado.
     * <p>
     * Ejemplo en la base de datos:
     * Si tienes un tema con el nombre "Clásico", la consulta JPQL sería:
     * SELECT i FROM Instrument i WHERE i.theme = :theme
     */
    List<Instrument> findByTheme(Theme theme);

    /**
     * Encuentra una lista de instrumentos cuyo nombre contenga una cadena específica, ignorando mayúsculas y minúsculas.
     *
     * @param name la cadena que debe estar contenida en el nombre de los instrumentos.
     * @return una lista de instrumentos cuyos nombres contienen la cadena especificada, ignorando mayúsculas y minúsculas.
     * <p>
     * Ejemplo en la base de datos:
     * Si buscas instrumentos cuyo nombre contenga "guitarra", la consulta JPQL sería:
     * SELECT i FROM Instrument i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :name, '%'))
     */
    Page<Instrument> findByNameContainingIgnoreCase(String name, Pageable pageable);

    Optional<Instrument> findByNameIgnoreCase(String name);
}
