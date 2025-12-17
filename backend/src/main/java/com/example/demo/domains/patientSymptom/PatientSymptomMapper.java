package com.example.demo.domains.patientSymptom;

import com.example.demo.controllers.patientSymptom.PatientSymptomDto;
import com.example.demo.repository.patientSymptom.PatientSymptomEntity;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.symptoms.SymptomEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientSymptomMapper {

    public PatientSymptomEntity toEntity(PatientSymptomDto dto) {
        PatientSymptomEntity entity = new PatientSymptomEntity();

        if (dto.getPatientId() != null ) {
            entity.setPatientId(dto.getPatientId());
        }
        if (dto.getSymptomId() != null ) {
            entity.setSymptomId(dto.getSymptomId());
        }
        entity.setSeverity(dto.getSeverity());

        return entity;
    }

    public PatientSymptomDto toDto(PatientSymptomEntity entity) {
        PatientSymptomDto dto = new PatientSymptomDto();

        dto.setPatientId(entity.getPatientId());
        dto.setSymptomId(entity.getSymptomId());
        dto.setSeverity(entity.getSeverity());

        return dto;
    }
}
