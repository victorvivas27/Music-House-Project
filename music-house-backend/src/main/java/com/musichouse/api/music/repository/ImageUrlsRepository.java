package com.musichouse.api.music.repository;

import com.musichouse.api.music.entity.ImageUrlsInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ImageUrlsRepository extends JpaRepository<ImageUrlsInstrument, UUID> {
   

    @Modifying
    @Query("DELETE FROM ImageUrlsInstrument i WHERE i.idImage = :idImage AND i.instrument.idInstrument = :idInstrument")
    void deleteImageByIdAndInstrumentId(@Param("idImage") UUID idImage,
                                        @Param("idInstrument") UUID idInstrument);

    @Query("SELECT i FROM ImageUrlsInstrument i WHERE i.instrument.idInstrument = :instrumentId")
    List<ImageUrlsInstrument> findByInstrumentId(@Param("instrumentId") UUID instrumentId);


}
