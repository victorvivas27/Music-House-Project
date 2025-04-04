package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Page<Category> findByCategoryNameContainingIgnoreCase(String categoryName, Pageable pageable);

    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);
}
