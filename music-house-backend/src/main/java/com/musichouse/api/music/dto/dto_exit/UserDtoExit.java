package com.musichouse.api.music.dto.dto_exit;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.musichouse.api.music.entity.Roles;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDtoExit {

    private UUID idUser;

    private String picture;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date registDate;

    private String name;

    private String lastName;

    private String email;

    private Long telegramChatId;

    private List<String> roles;

    private List<AddressDtoExit> addresses;

    private List<PhoneDtoExit> phones;

}
