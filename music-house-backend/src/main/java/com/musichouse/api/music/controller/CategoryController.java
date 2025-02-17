package com.musichouse.api.music.controller;

import com.musichouse.api.music.dto.dto_entrance.CategoryDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.CategoryDtoExit;
import com.musichouse.api.music.dto.dto_modify.CategoryDtoModify;
import com.musichouse.api.music.entity.Category;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.service.CategoryService;
import com.musichouse.api.music.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@AllArgsConstructor
@RequestMapping("/api/category")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CategoryDtoExit>> createCategory(@RequestBody @Valid CategoryDtoEntrance categoryDtoEntrance) {
        try {
            CategoryDtoExit categoryDtoExit = categoryService.createCategory(categoryDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Categoría creada exitosamente.", categoryDtoExit));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("La categoría ya existe en la base de datos.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Ocurrió un error al procesar la solicitud.", null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryDtoExit>>> allCategorys() {
        List<CategoryDtoExit> categoryDtoExits = categoryService.getAllCategories();
        ApiResponse<List<CategoryDtoExit>> response =
                new ApiResponse<>("Lista de Categorias exitosa.", categoryDtoExits);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/search/{idCategory}")
    public ResponseEntity<?> searchCategoryById(@PathVariable UUID idCategory) {
        try {
            CategoryDtoExit foundCategory = categoryService.getCategoryById(idCategory);
            return ResponseEntity.ok(new ApiResponse<>("Categoria encontrada.", foundCategory));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la categoria con el ID proporcionado.", null));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCategory(@RequestBody @Valid CategoryDtoModify categoryDtoModify) {
        try {
            CategoryDtoExit categoryDtoExit = categoryService.updateCategory(categoryDtoModify);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Categoria actualizada con éxito.", categoryDtoExit));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("No se encontró la categoria con el ID proporcionado.", null));
        }
    }

    @DeleteMapping("/delete/{idCategory}")
    public ResponseEntity<?> deleteCategory(@PathVariable UUID idCategory) {
        try {
            categoryService.deleteCategory(idCategory);
            return ResponseEntity.ok(new ApiResponse<>("Categoria con ID " + idCategory + " eliminada exitosamente.", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("La categoria con el ID " + idCategory + " no se encontró.", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(e.getMessage(), null));
        }
    }

    @GetMapping("/find/nameCategory/{categoryName}")
    public ResponseEntity<?> searchTheme(@PathVariable String categoryName) {
        try {
            List<Category> categories = categoryService.searchCategory(categoryName);
            if (categories.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>("No se encontraron las categorias con el nombre proporcionado.", null));
            }
            return ResponseEntity.ok(categories);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>("Parámetro de búsqueda inválido.", null));
        }
    }
}