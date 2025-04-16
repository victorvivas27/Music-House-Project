package com.musichouse.api.music.service.phone;

import com.musichouse.api.music.dto.dto_entrance.PhoneAddDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PhoneDtoExit;
import com.musichouse.api.music.dto.dto_modify.PhoneDtoModify;
import com.musichouse.api.music.entity.Phone;
import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.PhoneInterface;
import com.musichouse.api.music.repository.PhoneRepository;
import com.musichouse.api.music.repository.UserRepository;
import com.musichouse.api.music.service.user.UserValidator;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class PhoneService implements PhoneInterface {
    private final static Logger LOGGER = LoggerFactory.getLogger(PhoneService.class);
    private final PhoneRepository phoneRepository;
    private final ModelMapper mapper;
    private final UserRepository userRepository;
    private final UserValidator userValidator;
    private final PhoneValidator phoneValidator;

    @Override
    @CacheEvict(value = {"phones", "users"}, allEntries = true)
    public PhoneDtoExit addPhone(PhoneAddDtoEntrance phoneAddDtoEntrance) throws ResourceNotFoundException {

        User user = userValidator.validateUserId(phoneAddDtoEntrance.getIdUser());

        Phone phone = mapper.map(phoneAddDtoEntrance, Phone.class);

        phone.setUser(user);

        Phone phoneSaved = phoneRepository.save(phone);

        PhoneDtoExit phoneDtoExit = mapper.map(phoneSaved, PhoneDtoExit.class);

        phoneDtoExit.setIdUser(phoneDtoExit.getIdPhone());

        return phoneDtoExit;
    }


    @Override
    public PhoneDtoExit getPhoneById(UUID idPhone) throws ResourceNotFoundException {

        Phone phone = phoneValidator.validatePhoneId(idPhone);

        return mapper.map(phone, PhoneDtoExit.class);
    }

    @Override
    @CacheEvict(value = {"phones", "users"}, allEntries = true)
    public PhoneDtoExit updatePhone(PhoneDtoModify phoneDtoModify)
            throws ResourceNotFoundException {

        Phone phoneToUpdate = phoneValidator.validatePhoneId(phoneDtoModify.getIdPhone());

        mapper.map(phoneDtoModify, phoneToUpdate);

        Phone phoneSaved = phoneRepository.save(phoneToUpdate);

        return mapper.map(phoneSaved, PhoneDtoExit.class);

    }

    @Override
    @CacheEvict(value = {"phones", "users"}, allEntries = true)
    public void deletePhone(UUID idPhone)
            throws ResourceNotFoundException {

        Phone phoneToDelete = phoneValidator.validatePhoneId(idPhone);

        User user = phoneToDelete.getUser();

        if (user != null) {

            user.getPhones().remove(phoneToDelete);

            userRepository.save(user);

        }
        phoneRepository.deleteById(idPhone);

    }
}
