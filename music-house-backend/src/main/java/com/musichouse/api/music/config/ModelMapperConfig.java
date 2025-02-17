package com.musichouse.api.music.config;

import org.modelmapper.Conditions;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.spi.MappingContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Configurar ModelMapper para evitar sobrescribir valores nulos
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setPropertyCondition(Conditions.isNotNull());

        // Agregar conversión de Long a UUID
        Converter<Long, UUID> longToUuidConverter = new Converter<Long, UUID>() {
            public UUID convert(MappingContext<Long, UUID> context) {
                return context.getSource() != null ? UUID.nameUUIDFromBytes(context.getSource().toString().getBytes()) : null;
            }
        };

        // Agregar conversión de UUID a String
        Converter<UUID, String> uuidToStringConverter = new Converter<UUID, String>() {
            public String convert(MappingContext<UUID, String> context) {
                return context.getSource() != null ? context.getSource().toString() : null;
            }
        };

        modelMapper.addConverter(longToUuidConverter);
        modelMapper.addConverter(uuidToStringConverter);

        return modelMapper;
    }
}