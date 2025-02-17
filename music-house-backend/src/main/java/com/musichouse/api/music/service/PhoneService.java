package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.entity.Phone;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.PhoneInterface;
import com.musichouse.api.music.repository.PhoneRepository;
import com.musichouse.api.music.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PhoneService implements PhoneInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(PhoneService.class);
    private final PhoneRepository phoneRepository;
    private final ModelMapper mapper;
    private final UserRepository userRepository;

    @Override
    public PhoneDtoExit addPhone(PhoneAddDtoEntrance phoneAddDtoEntrance) throws ResourceNotFoundException {
        UUID userId = phoneAddDtoEntrance.getIdUser();
        if (userId == null) {
            throw new IllegalArgumentException("El idUser no puede ser nulo");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró el usuario con id: " + userId));
        Phone phone = new Phone();
        phone.setPhoneNumber(phoneAddDtoEntrance.getPhoneNumber());
        phone.setUser(user);
        Phone phoneSaved = phoneRepository.save(phone);
        PhoneDtoExit phoneDtoExit = new PhoneDtoExit();
        phoneDtoExit.setPhoneNumber(phoneSaved.getPhoneNumber());
        phoneDtoExit.setRegistDate(new Date());
        phoneDtoExit = mapper.map(phoneSaved, PhoneDtoExit.class);
        phoneDtoExit.setIdUser(userId);
        return phoneDtoExit;
    }

    @Override
    public List<PhoneDtoExit> getAllPhone() {
        List<PhoneDtoExit> phoneDtoExits = phoneRepository.findAll().stream()
                .map(phone -> mapper.map(phone, PhoneDtoExit.class)).toList();
        return phoneDtoExits;
    }

    @Override
    public PhoneDtoExit getPhoneById(UUID idPhone) throws ResourceNotFoundException {
        Phone phone = phoneRepository.findById(idPhone).orElse(null);
        PhoneDtoExit phoneDtoExit = null;
        if (phone != null) {
            phoneDtoExit = mapper.map(phone, PhoneDtoExit.class);
        } else {
            throw new ResourceNotFoundException("Phone not found with id: " + idPhone);
        }

        return phoneDtoExit;
    }

    @Override
    public PhoneDtoExit updatePhone(PhoneDtoModify phoneDtoModify) throws ResourceNotFoundException {
        Phone phoneToUpdate = phoneRepository.findById(phoneDtoModify.getIdPhone())
                .orElseThrow(() -> new ResourceNotFoundException("Phone not found with id: " + phoneDtoModify.getIdPhone()));
        phoneToUpdate.setPhoneNumber(phoneDtoModify.getPhoneNumber());
        phoneRepository.save(phoneToUpdate);
        return mapper.map(phoneToUpdate, PhoneDtoExit.class);

    }

    @Override
    public void deletePhone(UUID idPhone) throws ResourceNotFoundException {
        Phone phoneToDelete = phoneRepository.findById(idPhone)
                .orElseThrow(() -> new ResourceNotFoundException("Phone with id " + idPhone + " not found"));
        User user = phoneToDelete.getUser();
        if (user != null) {
            user.getPhones().remove(phoneToDelete);
            userRepository.save(user);

        }
        phoneRepository.deleteById(idPhone);

    }
}
