package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThemeDtoExit {

    private UUID idTheme;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String themeName;

    private String description;

    private List<ImagesUrlsDtoExit> imageUrls;

}
