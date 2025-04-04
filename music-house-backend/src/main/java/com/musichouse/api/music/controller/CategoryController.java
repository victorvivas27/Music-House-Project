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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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


        CategoryDtoExit categoryDtoExit = categoryService.createCategory(categoryDtoEntrance);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<CategoryDtoExit>builder()
                        .status(HttpStatus.CREATED)
                        .statusCode(HttpStatus.CREATED.value())
                        .message("Categoría creada exitosamente.")
                        .error(null)
                        .result(categoryDtoExit)
                        .build());

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


        CategoryDtoExit updatedCategory = categoryService.updateCategory(categoryDtoModify);

        return ResponseEntity.ok(ApiResponse.<CategoryDtoExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Categoría actualizada con éxito.")
                .error(null)
                .result(updatedCategory)
                .build());


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
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Category>>> searchCategoryByName(
            @RequestParam String name,
            Pageable pageable) {


        Page<Category> categories = categoryService.searchCategory(name, pageable);

        return ResponseEntity.ok(ApiResponse.<Page<Category>>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Búsqueda de categorías exitosa.")
                .error(null)
                .result(categories)
                .build());


    }
}