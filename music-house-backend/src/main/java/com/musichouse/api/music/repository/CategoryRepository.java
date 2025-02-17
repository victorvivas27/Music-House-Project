package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    List<Category> findBycategoryNameContaining(String categoryName);
}
