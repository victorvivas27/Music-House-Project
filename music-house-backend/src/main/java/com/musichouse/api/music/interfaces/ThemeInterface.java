package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.ThemeDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.ThemeDtoExit;
import com.musichouse.api.music.dto.dto_modify.ThemeDtoModify;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ThemeInterface {

    ThemeDtoExit createTheme(List<MultipartFile> files, ThemeDtoEntrance themeDtoEntrance
    ) throws ResourceNotFoundException;

    Page<ThemeDtoExit> getAllThemes(Pageable pageable);

    ThemeDtoExit getThemeById(UUID idTheme) throws ResourceNotFoundException;

    ThemeDtoExit updateTheme(ThemeDtoModify themeDtoModify) throws ResourceNotFoundException;

    void deleteTheme(UUID idTheme) throws ResourceNotFoundException;
}
