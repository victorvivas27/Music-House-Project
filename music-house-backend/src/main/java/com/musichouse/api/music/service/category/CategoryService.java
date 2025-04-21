package com.musichouse.api.music.service.category;

import com.musichouse.api.music.dto.dto_entrance.CategoryDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.CategoryDtoExit;
import com.musichouse.api.music.dto.dto_modify.CategoryDtoModify;
import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.exception.CategoryAssociatedException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.CategoryInterface;
import com.musichouse.api.music.repository.CategoryRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.service.StringValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class CategoryService implements CategoryInterface {
    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryService.class);
    private final CategoryRepository categoryRepository;
    private final ModelMapper mapper;
    private final InstrumentRepository instrumentRepository;
    private final CategoryValidator categoryValidator;

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDtoExit createCategory(CategoryDtoEntrance categoryDtoEntrance) {


        categoryValidator.validateUniqueName(categoryDtoEntrance);

        Category category = mapper.map(categoryDtoEntrance, Category.class);


        Category categorySaved = categoryRepository.save(category);

        return mapper.map(categorySaved, CategoryDtoExit.class);
    }


    @Override
    @Cacheable(value = "categories")
    public Page<CategoryDtoExit> getAllCategories(Pageable pageable) {


        Page<Category> categoriesPage = categoryRepository.findAll(pageable);

        return categoriesPage.map(category ->
                mapper.map(category, CategoryDtoExit.class));
    }


    @Override
    @Cacheable(value = "categories", key = "#idCategory")
    public CategoryDtoExit getCategoryById(UUID idCategory)
            throws ResourceNotFoundException {

        Category category = categoryValidator.validateCategoryId(idCategory);

        return mapper.map(category, CategoryDtoExit.class);
    }


    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDtoExit updateCategory(CategoryDtoModify categoryDtoModify)
            throws ResourceNotFoundException {

        Category category = categoryValidator.validateCategoryId(categoryDtoModify.getIdCategory());

        categoryValidator.validateUniqueName(categoryDtoModify, categoryDtoModify.getIdCategory());


        category = mapper.map(categoryDtoModify, Category.class);

        Category updatedCategory = categoryRepository.save(category);

        return mapper.map(updatedCategory, CategoryDtoExit.class);
    }


    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(UUID idCategory)
            throws ResourceNotFoundException, CategoryAssociatedException {

        Category categoryToDelete = categoryValidator.validateCategoryId(idCategory);

        categoryValidator.validateInstrumentAssociation(categoryToDelete.getIdCategory());

        categoryRepository.deleteById(idCategory);
    }

    @Override
    @Cacheable(
            value = "categories",
            key = "#categoryName + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()"
    )
    public Page<CategoryDtoExit> searchCategory(String categoryName, Pageable pageable) {

        StringValidator.validateBasicText(categoryName, categoryName);

        Page<Category> categories =
                categoryRepository.
                        findByCategoryNameContainingIgnoreCase(
                                categoryName.trim(),
                                pageable);

        return categories.map(category ->
                mapper.map(category, CategoryDtoExit.class));

    }
}
