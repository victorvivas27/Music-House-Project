package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Favorite;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    Favorite findByUserAndInstrument(User user, Instrument instrument);

    @Query("SELECT f FROM Favorite f WHERE f.user.id = :idUser")
    Page<Favorite> findByIdUser(@Param("idUser") UUID idUser, Pageable pageable);

    @Transactional
    void deleteByInstrumentIdInstrument(UUID idInstrument);

    @Transactional
    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.user.id = :idUser")
    void deleteByIdUser(@Param("idUser") UUID idUser);
}
