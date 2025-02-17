package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RolRepository extends JpaRepository<Role, UUID> {

    Optional<Role> findByRol(String rol);
}
