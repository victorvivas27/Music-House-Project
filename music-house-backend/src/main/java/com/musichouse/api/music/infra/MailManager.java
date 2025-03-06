package com.musichouse.api.music.infra;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Component
public class MailManager {
    private final static Logger LOGGER = LoggerFactory.getLogger(MailManager.class);
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String sender;

    public void sendMessage(String email, String name, String lastName, String picture) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            mimeMessage.setSubject("Confirmación de Registro");
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);

            // Set the content using Thymeleaf template
            Context context = new Context();
            context.setVariable("nombre", name);
            context.setVariable("apellido", lastName);
            context.setVariable("imagenURL", picture);
            String content = templateEngine.process("email_register", context);

            helper.setText(content, true);
            helper.setFrom(sender);

            ClassPathResource whatsappIcon = new ClassPathResource("static/img/whatsapp01.png");
            helper.addInline("whatsappIcon", whatsappIcon);
            ClassPathResource instagramIcon = new ClassPathResource("static/img/instagram01.png");
            helper.addInline("instagramIcon", instagramIcon);
            ClassPathResource facebookIcon = new ClassPathResource("static/img/facebook01.png");
            helper.addInline("facebookIcon", facebookIcon);
            ClassPathResource xIcon = new ClassPathResource("static/img/x-twitter01.png");
            helper.addInline("xIcon", xIcon);
            ClassPathResource logoImage = new ClassPathResource("static/img/logomusichousenegro-letranegro.png");
            helper.addInline("logoImage", logoImage);
            ClassPathResource backgroundImage = new ClassPathResource("static/img/magen3.png");
            helper.addInline("backgroundImage", backgroundImage);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendReservationConfirmation(String email,
                                            String name,
                                            String lastName,
                                            String instrumentName,
                                            LocalDate startDate,
                                            LocalDate endDate,
                                            String reservationCode,
                                            BigDecimal totalPrice,
                                            String imageURL) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        Context context = new Context();
        context.setVariable("nombre", name);
        context.setVariable("apellido", lastName);
        context.setVariable("instrumento", instrumentName);
        context.setVariable("fechaInicio", startDate.toString());
        context.setVariable("fechaFin", endDate.toString());
        context.setVariable("codigoReserva", reservationCode);
        context.setVariable("precioTotal", totalPrice.toString());
        context.setVariable("imagenURL", imageURL);

        String content = templateEngine.process("email_reservation", context);

        try {
            mimeMessage.setSubject("Confirmación de Reserva");
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setText(content, true);
            helper.setFrom(sender);

            ClassPathResource whatsappIcon = new ClassPathResource("static/img/whatsapp01.png");
            helper.addInline("whatsappIcon", whatsappIcon);
            ClassPathResource instagramIcon = new ClassPathResource("static/img/instagram01.png");
            helper.addInline("instagramIcon", instagramIcon);
            ClassPathResource facebookIcon = new ClassPathResource("static/img/facebook01.png");
            helper.addInline("facebookIcon", facebookIcon);
            ClassPathResource xIcon = new ClassPathResource("static/img/x-twitter01.png");
            helper.addInline("xIcon", xIcon);
            ClassPathResource logoImage = new ClassPathResource("static/img/logomusichousenegro-letranegro.png");
            helper.addInline("logoImage", logoImage);
            ClassPathResource backgroundImage = new ClassPathResource("static/img/magen3.png");
            helper.addInline("backgroundImage", backgroundImage);

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


}

