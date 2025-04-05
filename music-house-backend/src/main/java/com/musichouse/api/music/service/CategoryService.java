package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.CategoryDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.CategoryDtoExit;
import com.musichouse.api.music.dto.dto_modify.CategoryDtoModify;
import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.DuplicateNameException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.CategoryInterface;
import com.musichouse.api.music.repository.CategoryRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CategoryService implements CategoryInterface {
    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;

    @Override
    public CategoryDtoExit createCategory(CategoryDtoEntrance categoryDtoEntrance) {

        categoryRepository.findByCategoryNameIgnoreCase(categoryDtoEntrance.getCategoryName()).
                ifPresent(category -> {
                    throw new DuplicateNameException
                            ("Ya existe una categoria con ese nombre:" + categoryDtoEntrance.getCategoryName());
                });


        Category category = mapper.map(categoryDtoEntrance, Category.class);


        Category categorySaved = categoryRepository.save(category);

        return mapper.map(categorySaved, CategoryDtoExit.class);
    }


    @Override
    public Page<CategoryDtoExit> getAllCategories(Pageable pageable) {

        Page<Category> categoriesPage = categoryRepository.findAll(pageable);

        return categoriesPage.map(category -> mapper.map(category, CategoryDtoExit.class));
    }


    @Override
    public CategoryDtoExit getCategoryById(UUID idCategory) throws ResourceNotFoundException {
        Category category = categoryRepository.findById(idCategory)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con ID " + idCategory + " no encontrada"));

        return mapper.map(category, CategoryDtoExit.class);
    }


    @Override
    public CategoryDtoExit updateCategory(CategoryDtoModify categoryDtoModify)
            throws ResourceNotFoundException {

        UUID id = categoryDtoModify.getIdCategory();

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría con ID " + id + " no encontrada"));

        categoryRepository.findByCategoryNameIgnoreCase(categoryDtoModify.getCategoryName())
                .ifPresent(c -> {
                    if (!c.getIdCategory().equals(id)) {
                        throw new DuplicateNameException
                                ("Ya existe una categoría con ese nombre: " + categoryDtoModify.getCategoryName());
                    }
                });


        category.setCategoryName(categoryDtoModify.getCategoryName());
        category.setDescription(categoryDtoModify.getDescription());

        Category updatedCategory = categoryRepository.save(category);

        return mapper.map(updatedCategory, CategoryDtoExit.class);
    }


    @Override
    public void deleteCategory(UUID idCategory)
            throws ResourceNotFoundException, CategoryAssociatedException {

        Category categoryToDelete = categoryRepository.findById(idCategory)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Categoría con ID " + idCategory + " no encontrada"));

        List<Instrument> instruments = instrumentRepository.findByCategory(categoryToDelete);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException(
                    "No se puede eliminar la categoría con ID " + idCategory +
                            " ya que está asociada a instrumentos"
            );
        }

        categoryRepository.deleteById(idCategory);
    }


    public Page<CategoryDtoExit> searchCategory(String categoryName, Pageable pageable) {
        if (categoryName == null ||
                categoryName.trim().isEmpty() ||
                categoryName.matches(".*[^a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ\\s].*")) {
            throw new IllegalArgumentException
                    ("El parámetro de búsqueda es inválido. Ingrese solo letras, números o espacios.");
        }
        Page<Category> categories = categoryRepository.findByCategoryNameContainingIgnoreCase(categoryName.trim(), pageable);

        return categories.map(category -> mapper.map(category, CategoryDtoExit.class));

    }
}
