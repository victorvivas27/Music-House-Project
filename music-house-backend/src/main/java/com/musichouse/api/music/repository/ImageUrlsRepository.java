package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.Favorite;
import com.musichouse.api.music.entity.ImageUrls;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ImageUrlsRepository extends JpaRepository<ImageUrls, UUID> {
    @Modifying
    @Query("DELETE " +
            "FROM ImageUrls i WHERE i.idImage = " +
            ":idImage AND i.instrument.idInstrument = :idInstrument")
    void deleteImageByIdAndInstrumentId(UUID idImage, UUID idInstrument);

    @Query("SELECT i FROM ImageUrls i WHERE i.instrument.id = :instrumentId")
    List<ImageUrls> findByInstrumentId(@Param("instrumentId") UUID instrumentId);

}
