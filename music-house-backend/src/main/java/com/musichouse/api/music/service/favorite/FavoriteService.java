package com.musichouse.api.music.service.favorite;


import com.musichouse.api.music.dto.dto_entrance.FavoriteDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.dto.dto_exit.InstrumentFavoriteDtoExit;
import com.musichouse.api.music.entity.Favorite;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.FavoriteInterface;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.instrument.InstrumentValidator;
import com.musichouse.api.music.service.user.UserValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
public class FavoriteService implements FavoriteInterface {

    private static final Logger LOGGER = LoggerFactory.getLogger(FavoriteService.class);
    private final ModelMapper mapper;
    private final FavoriteRepository favoriteRepository;
    private final InstrumentRepository instrumentRepository;
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final InstrumentValidator instrumentValidator;
    private final FavoriteBuilder favoriteBuilder;

    @Override
    @Transactional
    @CacheEvict(value = "favorites", allEntries = true)
    public FavoriteDtoExit addFavorite(FavoriteDtoEntrance dto) throws ResourceNotFoundException {
        User user = userValidator.validateUserId(dto.getIdUser());

        Instrument instrument = instrumentValidator.validateInstrumentId(dto.getIdInstrument());

        Favorite toggledFavorite = favoriteBuilder.toggleFavorite(user, instrument);

        boolean isFavorite = toggledFavorite.getIsFavorite();

        InstrumentFavoriteDtoExit instrumentDto = favoriteBuilder.toInstrumentDto(instrument);

        return favoriteBuilder.buildFavoriteDto(toggledFavorite, instrumentDto, isFavorite);
    }


    @Override
    @Cacheable(value =
            "favorites", key = "#idUser + '-' + #pageable.pageNumber + '-' + #pageable.pageSize + '-' + #pageable.sort.toString()")
    public Page<FavoriteDtoExit> getFavoritesByUserId(UUID idUser, Pageable pageable) {
        Page<Favorite> favorites = favoriteRepository.findByIdUser(idUser, pageable);

        return favorites.map(favorite -> FavoriteDtoExit.builder()
                .idFavorite(favorite.getIdFavorite())
                .idUser(favorite.getUser().getIdUser())
                .registDate(favorite.getRegistDate())
                .instrument(favoriteBuilder.toInstrumentDto(favorite.getInstrument()))
                .build());
    }
}



