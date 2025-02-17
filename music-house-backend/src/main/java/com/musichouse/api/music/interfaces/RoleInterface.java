package com.musichouse.api.music.interfaces;

import com.musichouse.api.music.dto.dto_entrance.ChangeOfRole;
import com.musichouse.api.music.exception.ResourceNotFoundException;

public interface RoleInterface {


    public void addRoleToUser(ChangeOfRole changeOfRole) throws ResourceNotFoundException;

    public void removeRoleFromUser(ChangeOfRole changeOfRole) throws ResourceNotFoundException;
}
