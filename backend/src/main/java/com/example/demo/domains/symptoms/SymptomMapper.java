package com.example.demo.domains.symptoms;

import com.example.demo.controllers.symptoms.SymptomsDto;
import com.example.demo.repository.symptoms.SymptomEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SymptomMapper {

    public SymptomEntity toEntity(SymptomsDto dto) {
        SymptomEntity entity = new SymptomEntity();

        // id z DTO może być null przy tworzeniu nowego pacjenta
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public SymptomsDto toDto(SymptomEntity entity) {
        SymptomsDto dto = new SymptomsDto();

        dto.setId(entity.getId().toString());
        dto.setName(entity.getName());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
