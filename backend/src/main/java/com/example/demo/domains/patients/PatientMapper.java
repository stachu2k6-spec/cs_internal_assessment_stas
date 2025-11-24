package com.example.demo.domains.patients;

import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.repository.patients.PatientEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientMapper {

    public PatientEntity toEntity(PatientDto dto) {
        PatientEntity entity = new PatientEntity();

        // ID from DTO may be null when creating a new patient
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setSurname(dto.getSurname());
        entity.setBirthDate(dto.getBirthDate());
        entity.setGender(dto.getGender());
        entity.setAddress(dto.getAddress());
        entity.setPhoneNumber(dto.getPhoneNumber());
        entity.setEmail(dto.getEmail());
        entity.setNotes(dto.getNotes());
        entity.setActivityLevel(dto.getActivityLevel());
        entity.setPhotoUrl(dto.getPhotoUrl());

        return entity;
    }

    public PatientDto toDto(PatientEntity entity) {
        PatientDto dto = new PatientDto();

        if (entity.getId() != null) {
            dto.setId(entity.getId().toString());
        }

        dto.setName(entity.getName());
        dto.setSurname(entity.getSurname());
        dto.setGender(entity.getGender());
        dto.setBirthDate(entity.getBirthDate());
        dto.setAddress(entity.getAddress());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setEmail(entity.getEmail());
        dto.setNotes(entity.getNotes());
        dto.setActivityLevel(entity.getActivityLevel());
        dto.setPhotoUrl(entity.getPhotoUrl());

        return dto;
    }
}

