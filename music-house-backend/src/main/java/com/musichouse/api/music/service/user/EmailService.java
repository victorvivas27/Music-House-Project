package com.musichouse.api.music.service.user;

import com.musichouse.api.music.entity.User;
import com.musichouse.api.music.infra.MailManager;
import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailService {
    private final MailManager mailManager;

    public void sendWelcomeEmail(User user) throws MessagingException {
        mailManager.sendMessage(user.getEmail(), user.getName(), user.getLastName());
    }
}
