package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.FavoriteDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.FavoriteDtoExit;
import com.musichouse.api.music.dto.dto_exit.IsFavoriteExit;
import com.musichouse.api.music.entity.Favorite;
import com.musichouse.api.music.entity.ImageUrls;
import com.musichouse.api.music.entity.Instrument;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.FavoriteAlreadyExistsException;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.FavoriteInterface;
import com.musichouse.api.music.repository.FavoriteRepository;
import com.musichouse.api.music.repository.InstrumentRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.util.ApiResponse;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FavoriteService implements FavoriteInterface {
    private static final Logger LOGGER = LoggerFactory.getLogger(FavoriteService.class);
    private final ModelMapper mapper;
    private final FavoriteRepository favoriteRepository;
    private final InstrumentRepository instrumentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public FavoriteDtoExit addFavorite(FavoriteDtoEntrance favoriteDtoEntrance) throws ResourceNotFoundException {
        UUID instrumentId = favoriteDtoEntrance.getIdInstrument();
        UUID userId = favoriteDtoEntrance.getIdUser();

        Instrument instrument = instrumentRepository.findById(instrumentId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el instrumento con el ID proporcionado"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con el ID proporcionado"));

        Favorite existingFavorite = favoriteRepository.findByUserAndInstrument(user, instrument);

        String imageUrl = instrument.getImageUrls() != null && !instrument.getImageUrls().isEmpty()
                ? instrument.getImageUrls().get(0).getImageUrl()
                : "";

        // ✅ Si ya existe → eliminarlo
        if (existingFavorite != null) {
            favoriteRepository.delete(existingFavorite);
            return FavoriteDtoExit.builder()
                    .idFavorite(existingFavorite.getIdFavorite())
                    .instrument(instrument)
                    .imageUrl(imageUrl)
                    .idUser(user.getIdUser())
                    .registDate(existingFavorite.getRegistDate())
                    .isFavorite(false)
                    .build();
        }

        // ✅ Si no existe → crearlo
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setInstrument(instrument);
        favorite.setIsFavorite(true);
        Favorite favoriteSaved = favoriteRepository.save(favorite);

        return FavoriteDtoExit.builder()
                .idFavorite(favoriteSaved.getIdFavorite())
                .instrument(favoriteSaved.getInstrument())
                .imageUrl(imageUrl)
                .idUser(favoriteSaved.getUser().getIdUser())
                .registDate(favoriteSaved.getRegistDate())
                .isFavorite(true)
                .build();
    }

    @Override
    public List<FavoriteDtoExit> getAllFavorite() {
        return favoriteRepository.findAll().stream()
                .map(favorite -> {
                    FavoriteDtoExit favoriteDtoExit = mapper.map(favorite, FavoriteDtoExit.class);
                    String imageUrl = favorite.getInstrument().getImageUrls() != null &&
                            !favorite.getInstrument().getImageUrls().isEmpty()
                            ? favorite.getInstrument().getImageUrls().get(0).getImageUrl()
                            : "";
                    favoriteDtoExit.setImageUrl(imageUrl);
                    favoriteDtoExit.setIsFavorite(favorite.getIsFavorite());
                    return favoriteDtoExit;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<FavoriteDtoExit> getFavoritesByUserId(UUID userId) throws ResourceNotFoundException {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        if (favorites.isEmpty()) {
            throw new ResourceNotFoundException("No se encontraron favoritos para el usuario con ID: " + userId);
        }

        return favorites.stream()
                .map(favorite -> {
                    FavoriteDtoExit favoriteDtoExit = mapper.map(favorite, FavoriteDtoExit.class);
                    String imageUrl = favorite.getInstrument().getImageUrls() != null &&
                            !favorite.getInstrument().getImageUrls().isEmpty()
                            ? favorite.getInstrument().getImageUrls().get(0).getImageUrl()
                            : "";
                    favoriteDtoExit.setImageUrl(imageUrl);
                    return favoriteDtoExit;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ApiResponse<IsFavoriteExit> deleteFavorite(UUID idInstrument, UUID idUser, UUID idFavorite) throws ResourceNotFoundException {
        User user = userRepository.findById(idUser)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID " + idUser));

        Instrument instrument = instrumentRepository.findById(idInstrument)
                .orElseThrow(() -> new ResourceNotFoundException("Instrumento no encontrado con ID " + idInstrument));

        Favorite favorite = favoriteRepository.findById(idFavorite)
                .orElseThrow(() -> new ResourceNotFoundException("Favorito no encontrado con ID " + idFavorite));

        if (!favorite.getUser().getIdUser().equals(idUser) || !favorite.getInstrument().getIdInstrument().equals(idInstrument)) {
            throw new ResourceNotFoundException("Favorito no encontrado para el usuario con ID " + idUser +
                    " y el instrumento con ID " + idInstrument);
        }

        // ** Eliminar favorito **
        favoriteRepository.delete(favorite);
        IsFavoriteExit isFavoriteExit = new IsFavoriteExit();
        isFavoriteExit.setIsFavorite(false);

        LOGGER.info("Favorito eliminado con éxito: ID Usuario {}, ID Instrumento {}", idUser, idInstrument);

        return ApiResponse.<IsFavoriteExit>builder()
                .status(HttpStatus.OK)
                .statusCode(HttpStatus.OK.value())
                .message("Favorito eliminado exitosamente.")
                .data(isFavoriteExit)
                .error(null)
                .build();
    }
}
