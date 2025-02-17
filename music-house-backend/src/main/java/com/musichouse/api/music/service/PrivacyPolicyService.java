package com.musichouse.api.music.service;

import com.musichouse.api.music.dto.dto_entrance.PrivacyPolicyDtoEntrance;
import com.musichouse.api.music.dto.dto_exit.PrivacyPolicyDtoExit;
import com.musichouse.api.music.dto.dto_modify.PrivacyPolicyDtoModify;
import com.musichouse.api.music.entity.PrivacyPolicy;
import com.musichouse.api.music.exception.ResourceNotFoundException;
import com.musichouse.api.music.interfaces.PrivacyPolicyInterface;
import com.musichouse.api.music.repository.PrivacyPolicyRepocitory;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PrivacyPolicyService implements PrivacyPolicyInterface {

    private final static Logger LOGGER = LoggerFactory.getLogger(PrivacyPolicyService.class);
    private final PrivacyPolicyRepocitory privacyPolicyRepocitory;
    private final ModelMapper mapper;

    @Override
    @Transactional
    public PrivacyPolicyDtoExit createPrivacyPolicy(PrivacyPolicyDtoEntrance privacyPolicyDtoEntrance) {
        PrivacyPolicy privacyPolicy = new PrivacyPolicy();
        privacyPolicy.setTitle(privacyPolicyDtoEntrance.getTitle());
        privacyPolicy.setContent(privacyPolicyDtoEntrance.getContent());
        PrivacyPolicy privacyPolicySaved = privacyPolicyRepocitory.save(privacyPolicy);
        PrivacyPolicyDtoExit privacyPolicyDtoExit = new PrivacyPolicyDtoExit();
        privacyPolicyDtoExit.setTitle(privacyPolicySaved.getTitle());
        privacyPolicyDtoExit.setContent(privacyPolicySaved.getContent());
        privacyPolicyDtoExit.setRegistDate(new Date());
        privacyPolicyDtoExit = mapper.map(privacyPolicySaved, PrivacyPolicyDtoExit.class);
        return privacyPolicyDtoExit;
    }

    @Override
    public List<PrivacyPolicyDtoExit> getAllPrivacyPolicy() {
        return privacyPolicyRepocitory.findAll().stream()
                .map(privacyPolicy -> mapper.map(privacyPolicy, PrivacyPolicyDtoExit.class)).toList();
    }

    @Override
    public PrivacyPolicyDtoExit updatePrivacyPolicy(PrivacyPolicyDtoModify privacyPolicyDtoModify) throws ResourceNotFoundException {
        PrivacyPolicy privacyPolicyUpdate = privacyPolicyRepocitory.findById(privacyPolicyDtoModify.getIdPrivacyPolicy())
                .orElseThrow(() -> new ResourceNotFoundException
                        ("Politica de privacidad con ID:" +
                                privacyPolicyDtoModify.getIdPrivacyPolicy() + "no encontrado "));
        privacyPolicyUpdate.setTitle(privacyPolicyDtoModify.getTitle());
        privacyPolicyUpdate.setContent(privacyPolicyDtoModify.getContent());
        privacyPolicyRepocitory.save(privacyPolicyUpdate);
        return mapper.map(privacyPolicyUpdate, PrivacyPolicyDtoExit.class);
    }

    @Override
    public void deleteidPrivacyPolicy(UUID idPrivacyPolicy) throws ResourceNotFoundException {
        if (privacyPolicyRepocitory.findById(idPrivacyPolicy).orElse(null) != null) {
            privacyPolicyRepocitory.deleteById(idPrivacyPolicy);
        } else {
            throw new ResourceNotFoundException
                    ("No se ha encontrado la politica de privacidad con ID: " + idPrivacyPolicy);
        }

    }
}
