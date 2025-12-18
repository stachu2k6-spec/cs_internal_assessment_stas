package com.example.demo.domains.patientSymptom;

import com.example.demo.controllers.patientSymptom.PatientSymptomDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.controllers.symptoms.SymptomDto;
import com.example.demo.domains.patients.PatientMapper;
import com.example.demo.domains.symptoms.SymptomMapper;
import com.example.demo.repository.patientSymptom.PatientSymptomEntity;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import com.example.demo.repository.symptoms.SymptomEntity;
import com.example.demo.repository.symptoms.SymptomRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PatientSymptomMapper {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;
    
    public PatientSymptomMapper(PatientRepository patientRepository, PatientMapper patientMapper, SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    public PatientSymptomEntity toEntity(PatientSymptomDto dto) {
        PatientSymptomEntity entity = new PatientSymptomEntity();
        
        entity.getPatient().setId(dto.getSymptom().getId());
        entity.setSeverity(dto.getSeverity());

        PatientEntity p = patientRepository.findById(dto.getPatient().getId()).get();
        entity.setPatient(p);
        
        SymptomEntity s = symptomRepository.findById(dto.getSymptom().getId()).get();
        entity.setSymptom(s);

        return entity;
    }

    public PatientSymptomDto toDto(PatientSymptomEntity entity) {
        PatientSymptomDto dto = new PatientSymptomDto();

        dto.setId(entity.getId());

        PatientDto patientDto = patientMapper.toDto(entity.getPatient());
        dto.setPatient(patientDto);

        SymptomDto symptomDto = symptomMapper.toDto(entity.getSymptom());
        dto.setSymptom(symptomDto);
        
        dto.setSeverity(entity.getSeverity());

        return dto;
    }
}
