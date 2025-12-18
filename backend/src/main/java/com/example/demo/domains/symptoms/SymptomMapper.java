package com.example.demo.domains.symptoms;

import com.example.demo.controllers.symptoms.SymptomDto;
import com.example.demo.repository.symptoms.SymptomEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SymptomMapper {

    public SymptomEntity toEntity(SymptomDto dto) {
        SymptomEntity entity = new SymptomEntity();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setName(dto.getName());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public SymptomDto toDto(SymptomEntity entity) {
        SymptomDto dto = new SymptomDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
