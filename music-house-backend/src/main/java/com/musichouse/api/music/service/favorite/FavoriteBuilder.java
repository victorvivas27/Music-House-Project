package com.musichouse.api.music.service.favorite;

import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.dto.dto_exit.InstrumentFavoriteDtoExit;
import com.musichouse.api.music.entity.Favorite;
import com.musichouse.api.music.entity.ImageUrlsInstrument;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.repository.FavoriteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class FavoriteBuilder {
    private final FavoriteRepository favoriteRepository;

    public FavoriteDtoExit buildFavoriteDto(Favorite favorite, InstrumentFavoriteDtoExit instrument, boolean isFavorite) {

        return FavoriteDtoExit.builder()
                .idFavorite(favorite.getIdFavorite())
                .idUser(favorite.getUser().getIdUser())
                .registDate(favorite.getRegistDate())
                .instrument(instrument)
                .isFavorite(isFavorite)
                .build();
    }


    public InstrumentFavoriteDtoExit toInstrumentDto(Instrument instrument) {

        return InstrumentFavoriteDtoExit.builder()
                .idInstrument(instrument.getIdInstrument())
                .name(instrument.getName())
                .imageUrl(instrument.getImageUrls().stream()
                        .findFirst()
                        .map(ImageUrlsInstrument::getImageUrl)
                        .orElse(null))
                .build();
    }

    public Favorite toggleFavorite(User user, Instrument instrument) {

        Favorite existing = favoriteRepository.findByUserAndInstrument(user, instrument);

        if (existing != null) {

            favoriteRepository.delete(existing);

            existing.setIsFavorite(false);

            return existing;

        } else {
            Favorite newFavorite = Favorite.builder()
                    .user(user)
                    .instrument(instrument)
                    .isFavorite(true)
                    .build();
            return favoriteRepository.save(newFavorite);
        }
    }
}

