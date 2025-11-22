package com.example.demo.domains.patients;

import com.example.demo.controllers.patients.PatientsDto;
import com.example.demo.repository.patients.PatientEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientMapper {

    public PatientEntity toEntity(PatientsDto dto) {
        PatientEntity entity = new PatientEntity();

        // id z DTO może być null przy tworzeniu nowego pacjenta
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public PatientsDto toDto(PatientEntity entity) {
        PatientsDto dto = new PatientsDto();

        dto.setId(entity.getId().toString());
        dto.setName(entity.getName());
        dto.setSurname(entity.getSurname());
        dto.setAddress(entity.getAddress());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
