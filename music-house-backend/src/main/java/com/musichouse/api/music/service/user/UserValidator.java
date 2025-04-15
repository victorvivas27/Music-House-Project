package com.musichouse.api.music.service.user;

import com.musichouse.api.music.dto.dto_entrance.UserDtoEntrance;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@AllArgsConstructor
public class UserValidator {
    private final UserRepository userRepository;

    public void validateUniqueEmail(UserDtoEntrance userDtoEntrance) {

        if (userRepository.existsByEmail(userDtoEntrance.getEmail())) {
            throw new DataIntegrityViolationException(
                    "El correo electrónico: " + userDtoEntrance.getEmail() + " ya esta en uso");
        }
    }

    public User validateUserExistsByEmail(String email) throws ResourceNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado con el correo electrónico: " + email));
    }

    public User validateUserId(UUID idUser)
            throws ResourceNotFoundException {
        return userRepository.findById(idUser)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario con ID " + idUser + " no encontrada"));
    }

    public void validateEmailNotTakenOnUpdate(User existingUser, String newEmail) {
        if (!existingUser.getEmail().equalsIgnoreCase(newEmail) &&
                userRepository.existsByEmail(newEmail)) {
            throw new DataIntegrityViolationException(
                    "El correo electrónico ingresado ya está en uso por otro usuario.");
        }
    }

}
