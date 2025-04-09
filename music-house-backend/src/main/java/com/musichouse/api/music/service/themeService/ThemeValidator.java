package com.musichouse.api.music.service.themeService;

import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.Theme;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.DuplicateNameException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.HasName;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.ThemeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Component
@AllArgsConstructor
public class ThemeValidator {

    private final ThemeRepository themeRepository;
    private final InstrumentRepository instrumentRepository;

    /**
     * Valida que no exista una temática con el mismo nombre (ignorando mayúsculas/minúsculas).
     *
     * @param dto Objeto que implementa la interfaz {@link HasName}, del cual se obtiene el nombre a validar.
     * @throws DuplicateNameException si ya existe una temática con el mismo nombre.
     */
    public void validateUniqueName(HasName dto) {
        themeRepository.findByThemeNameIgnoreCase(dto.getName())
                .ifPresent(existing -> {
                    throw new DuplicateNameException(
                            "Ya existe una temática con ese nombre: " + dto.getName());
                });
    }

    /**
     * Valida que no exista otra temática con el mismo nombre, excluyendo el ID actual.
     * Usado durante la modificación.
     *
     * @param dto       Objeto que contiene el nombre de la temática.
     * @param currentId ID de la temática que se está modificando.
     * @throws DuplicateNameException si el nombre ya está en uso por otra temática.
     */
    public void validateUniqueName(HasName dto, UUID currentId) {
        themeRepository.findByThemeNameIgnoreCase(dto.getName())
                .ifPresent(existing -> {
                    if (!existing.getIdTheme().equals(currentId)) {
                        throw new DuplicateNameException(
                                "Ya existe una temática con ese nombre: " + dto.getName());
                    }
                });
    }

    /**
     * Valida que una temática con el ID proporcionado exista en la base de datos.
     *
     * @param idTheme ID de la temática a validar.
     * @return La entidad {@link Theme} correspondiente al ID.
     * @throws ResourceNotFoundException si no se encuentra ninguna temática con ese ID.
     */
    public Theme validateThemeId(UUID idTheme)
            throws ResourceNotFoundException {
        return themeRepository.findById(idTheme)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Temática con ID " + idTheme + " no encontrada"));
    }

    /**
     * Valida que la temática con el ID proporcionado no esté asociada a ningún instrumento.
     * Esto se utiliza, por ejemplo, antes de eliminar una temática para evitar borrar registros en uso.
     *
     * @param idTheme ID de la temática a validar.
     * @throws ResourceNotFoundException   si la temática no existe.
     * @throws CategoryAssociatedException si existen instrumentos asociados a la temática.
     */
    public void validateInstrumentAssociation(UUID idTheme)
            throws ResourceNotFoundException {
        Theme theme = validateThemeId(idTheme);

        List<Instrument> instruments = instrumentRepository.findByTheme(theme);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException(
                    "No se puede eliminar la temática porque está asociada a uno o más instrumentos.");
        }
    }

    /**
     * Valida que no exista en la base de datos otra temática que ya tenga una imagen
     * con el mismo nombre de archivo.
     * <p>
     * Se asume que las URLs de imagen siguen el formato:
     * <pre>
     *     https://bucket.s3.region.amazonaws.com/theme/{uuid}/{timestamp}_{originalFilename}
     * </pre>
     * Por ejemplo:
     * <pre>
     *     https://.../theme/abc123/1712523779000_foto.jpg
     * </pre>
     * Este método extrae el nombre original del archivo (por ejemplo, "foto.jpg")
     * desde la URL y lo compara contra el nombre recibido.
     *
     * @param filename El nombre original del archivo (por ejemplo, file.getOriginalFilename()).
     * @throws DuplicateNameException si se encuentra una coincidencia exacta del nombre de archivo
     *                                en una temática ya existente.
     */

    public void validateDuplicateImageByFilename(String filename) {
        boolean exists = themeRepository.findAll().stream()
                .map(Theme::getImageUrlTheme)
                .filter(Objects::nonNull)
                .map(url -> {
                    String filePart = url.substring(url.lastIndexOf('/') + 1);
                    int underscore = filePart.indexOf('_');
                    return underscore != -1 ? filePart.substring(underscore + 1) : filePart;
                })
                .anyMatch(name -> name.equals(filename));

        if (exists) {
            throw new DuplicateNameException(
                    "La imagen '" + filename + "' ya fue usada en otra temática.");
        }
    }
}
