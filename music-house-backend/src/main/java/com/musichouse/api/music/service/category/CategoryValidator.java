package com.musichouse.api.music.service.category;

import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.DuplicateNameException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.HasName;
import com.musichouse.api.music.repository.CategoryRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@AllArgsConstructor
public class CategoryValidator {
    private final CategoryRepository categoryRepository;
    private final InstrumentRepository instrumentRepository;

    public void validateUniqueName(HasName dto) {
        categoryRepository.findByCategoryNameIgnoreCase(dto.getName())
                .ifPresent(existing -> {
                    throw new DuplicateNameException(
                            "Ya existe una temática con ese nombre: " + dto.getName());
                });
    }

    public Category validateCategoryId(UUID idCategory) throws ResourceNotFoundException {
        return categoryRepository.findById(idCategory)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria con ID " + idCategory + " no encontrada"));
    }

    public void validateUniqueName(HasName dto, UUID currentId) {
        categoryRepository.findByCategoryNameIgnoreCase(dto.getName())
                .ifPresent(existing -> {
                    if (!existing.getIdCategory().equals(currentId)) {
                        throw new DuplicateNameException(
                                "Ya existe una categoria con ese nombre: " + dto.getName());
                    }
                });
    }

    public void validateInstrumentAssociation(UUID idCategory)
            throws ResourceNotFoundException {
        Category category = validateCategoryId(idCategory);

        List<Instrument> instruments = instrumentRepository.findByCategory(category);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException(
                    "No se puede eliminar la categoria porque está asociada a uno o más instrumentos.");
        }
    }
}
