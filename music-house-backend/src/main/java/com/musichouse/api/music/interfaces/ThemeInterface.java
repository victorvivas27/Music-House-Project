package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ThemeInterface {

    ThemeDtoExit createTheme(ThemeDtoEntrance themeDtoEntrance, MultipartFile file)
            throws ResourceNotFoundException;

    Page<ThemeDtoExit> getAllThemes(Pageable pageable);

    ThemeDtoExit getThemeById(UUID idTheme)
            throws ResourceNotFoundException;

    ThemeDtoExit updateTheme(ThemeDtoModify themeDtoModify, MultipartFile file)
            throws ResourceNotFoundException;

    void deleteTheme(UUID idTheme)
            throws ResourceNotFoundException;
}
