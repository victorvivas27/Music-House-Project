package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.CategoryDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.CategoryDtoExit;
import com.musichouse.api.music.dto.dto_modify.CategoryDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CategoryInterface {

    CategoryDtoExit createCategory(CategoryDtoEntrance categoryDtoEntrance);

    Page<CategoryDtoExit> getAllCategories(Pageable pageable);

    CategoryDtoExit getCategoryById(UUID idCategory) throws ResourceNotFoundException;

    CategoryDtoExit updateCategory(CategoryDtoModify categoryDtoModify) throws ResourceNotFoundException;

    void deleteCategory(UUID idCategory) throws ResourceNotFoundException;

}
