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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryController.class);
    private final CategoryService categoryService;

    // 🔹 CREAR CATEGORÍA
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CategoryDtoExit>> createCategory(
            @RequestBody @Valid CategoryDtoEntrance categoryDtoEntrance) {

        try {
            CategoryDtoExit categoryDtoExit = categoryService.createCategory(categoryDtoEntrance);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.<CategoryDtoExit>builder()
                            .status(HttpStatus.CREATED)
                            .statusCode(HttpStatus.CREATED.value())
                            .message("Categoría creada exitosamente.")
                            .error(null)
                            .result(categoryDtoExit)
                            .build());
        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.<CategoryDtoExit>builder()
                            .status(HttpStatus.CONFLICT)
                            .statusCode(HttpStatus.CONFLICT.value())
                            .message("La categoría ya existe en la base de datos.")
                            .error(e.getMessage())
                            .result(null)
                            .build());
        }
    }

    // 🔹 OBTENER TODAS LAS CATEGORÍAS
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<CategoryDtoExit>>> getAllCategories() {
        List<CategoryDtoExit> categories = categoryService.getAllCategories();

        return ResponseEntity.ok(ApiResponse.<List<CategoryDtoExit>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Lista de categorías obtenida con éxito.")
                .error(null)
                .result(categories)
                .build());
    }

    // 🔹 BUSCAR CATEGORÍA POR ID
    @GetMapping("/search/{idCategory}")
    public ResponseEntity<ApiResponse<CategoryDtoExit>> searchCategoryById(@PathVariable UUID idCategory) throws ResourceNotFoundException {
        CategoryDtoExit foundCategory = categoryService.getCategoryById(idCategory);

        return ResponseEntity.ok(ApiResponse.<CategoryDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Categoría encontrada con éxito.")
                .error(null)
                .result(foundCategory)
                .build());
    }

    // 🔹 ACTUALIZAR CATEGORÍA
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<?>> updateCategory(
            @RequestBody @Valid CategoryDtoModify categoryDtoModify) throws ResourceNotFoundException {

        try {
            CategoryDtoExit updatedCategory = categoryService.updateCategory(categoryDtoModify);

            return ResponseEntity.ok(ApiResponse.<CategoryDtoExit>builder()
                    .status(HttpStatus.OK)
                    .statusCode(HttpStatus.OK.value())
                    .message("Categoría actualizada con éxito.")
                    .error(null)
                    .result(updatedCategory)
                    .build());
        } catch (ResourceNotFoundException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UUID>builder()
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .message("No se encontró la categoria con el ID proporcionado.")
                            .error(e.getMessage())
                            .result(categoryDtoModify.getIdCategory())
                            .build());
        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.<String>builder()
                            .status(HttpStatus.CONFLICT)
                            .statusCode(HttpStatus.CONFLICT.value())
                            .message("La categoría ya existe en la base de datos.")
                            .error(e.getRootCause() != null ? e.getRootCause().getMessage() : e.getMessage())
                            .result(categoryDtoModify.getCategoryName())
                            .build());
        }
    }

    // 🔹 ELIMINAR CATEGORÍA
    @DeleteMapping("/delete/{idCategory}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable UUID idCategory) throws ResourceNotFoundException {

        categoryService.deleteCategory(idCategory);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Categoría eliminada exitosamente.")
                .error(null)
                .result(null)
                .build());
    }

    // 🔹 BUSCAR CATEGORÍAS POR NOMBRE
    @GetMapping("/find/nameCategory/{categoryName}")
    public ResponseEntity<ApiResponse<List<Category>>> searchCategoryByName(@PathVariable String categoryName) {
        List<Category> categories = categoryService.searchCategory(categoryName);

        return ResponseEntity.ok(ApiResponse.<List<Category>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda de categorías exitosa.")
                .error(null)
                .result(categories)
                .build());
    }
}