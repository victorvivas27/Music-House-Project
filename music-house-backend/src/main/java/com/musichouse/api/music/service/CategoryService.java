package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.CategoryDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.CategoryDtoExit;
import com.musichouse.api.music.dto.dto_modify.CategoryDtoModify;
import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.CategoryInterface;
import com.musichouse.api.music.repository.CategoryRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

        categoryDtoEntrance.setCategoryName(categoryDtoEntrance.getCategoryName().toUpperCase());

        Category category = mapper.map(categoryDtoEntrance, Category.class);


        Category categorySaved = categoryRepository.save(category);

        CategoryDtoExit categoryDtoExit = mapper.map(categorySaved, CategoryDtoExit.class);

        return categoryDtoExit;
    }



    @Override
    public List<CategoryDtoExit> getAllCategories() {

        List<CategoryDtoExit> categoryDtoExits = categoryRepository.findAll().stream()
                .map(category -> mapper.map(category, CategoryDtoExit.class)).toList();
        return categoryDtoExits;
    }



    @Override
    public CategoryDtoExit getCategoryById(UUID idCategory) throws ResourceNotFoundException {

        Category category = categoryRepository.findById(idCategory).orElse(null);

        CategoryDtoExit categoryDtoExit = null;

        if (category != null) {
            categoryDtoExit = mapper.map(category, CategoryDtoExit.class);

        } else {
            throw new ResourceNotFoundException("Category with id " + idCategory + " not found");

        }
        return categoryDtoExit;
    }



    @Override
    public CategoryDtoExit updateCategory(CategoryDtoModify categoryDtoModify)
            throws ResourceNotFoundException {

        categoryDtoModify.setCategoryName(categoryDtoModify.getCategoryName().toUpperCase());

        Category categoryToUpdate = categoryRepository.findById(categoryDtoModify.getIdCategory())
                .orElseThrow(() ->
                        new ResourceNotFoundException
                                ("Category with id " + categoryDtoModify.getIdCategory() + " not found"));

        categoryToUpdate.setCategoryName(categoryDtoModify.getCategoryName());

        categoryToUpdate.setDescription(categoryDtoModify.getDescription());

        categoryRepository.save(categoryToUpdate);

        return mapper.map(categoryToUpdate, CategoryDtoExit.class);
    }



    @Override
    public void deleteCategory(UUID idCategory)
            throws ResourceNotFoundException, CategoryAssociatedException {

        Category categoryToDelete = categoryRepository.findById(idCategory)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category with id " + idCategory + " not found"));

        List<Instrument> instruments = instrumentRepository.findByCategory(categoryToDelete);

        if (!instruments.isEmpty()) {
            throw new CategoryAssociatedException("Cannot delete category with id " + idCategory +
                    " as it is associated with instruments");
        }

        categoryRepository.deleteById(idCategory);
    }



    public List<Category> searchCategory(String categoryName) throws IllegalArgumentException {
        if (categoryName != null) {
            return categoryRepository.findBycategoryNameContaining(categoryName);
        } else {
            throw new IllegalArgumentException("Parámetro de búsqueda inválido");
        }
    }
}
