package com.musichouse.api.music.interfaces;


import com.musichouse.api.music.dto.dto_entrance.FavoriteDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface FavoriteInterface {

    FavoriteDtoExit addFavorite(FavoriteDtoEntrance favoriteDtoEntrance) throws ResourceNotFoundException;


    Page<FavoriteDtoExit> getFavoritesByUserId(UUID idUser, Pageable pageable) throws ResourceNotFoundException;


}
