package com.example.demo.domains.patientSymptom;

import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.controllers.patientSymptom.PatientSymptomDto;
import com.example.demo.domains.meetings.MeetingMapper;
import com.example.demo.domains.patientSymptom.PatientSymptomMapper;
import com.example.demo.domains.patients.PatientMapper;
import com.example.demo.domains.symptoms.SymptomMapper;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.meetings.MeetingRepository;
import com.example.demo.repository.patientSymptom.PatientSymptomEntity;
import com.example.demo.repository.patientSymptom.PatientSymptomRepository;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import com.example.demo.repository.symptoms.SymptomEntity;
import com.example.demo.repository.symptoms.SymptomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PatientSymptomFacade {

    private final PatientSymptomRepository patientSymptomRepository;
    private final PatientSymptomMapper patientSymptomMapper;
    
    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    
    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;

    public PatientSymptomFacade(PatientSymptomRepository patientSymptomRepository, PatientSymptomMapper patientSymptomMapper, PatientRepository patientRepository, PatientMapper patientMapper, SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.patientSymptomRepository = patientSymptomRepository;
        this.patientSymptomMapper = patientSymptomMapper;
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    public List<PatientSymptomDto> getPatientSymptoms() {
        return patientSymptomRepository.findAll()
                .stream()
                .map(patientSymptomMapper::toDto)
                .toList();
    }

    public PatientSymptomDto getPatientSymptomById(String id) {
        return patientSymptomRepository.findById(UUID.fromString(id))
                .map(patientSymptomMapper::toDto)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "PatientSymptom not found")
                );
    }

    public List<PatientSymptomDto> getPatientSymptomsByPatientId(String patientId) {
        return patientSymptomRepository.findByPatientId(UUID.fromString(patientId))
                .stream()
                .map(patientSymptomMapper::toDto)
                .toList();
    }

    public PatientSymptomDto addPatientSymptom(PatientSymptomDto patientSymptomDto) {
        PatientSymptomEntity patientSymptomEntity = patientSymptomMapper.toEntity(patientSymptomDto);
        PatientSymptomEntity savedEntity = patientSymptomRepository.save(patientSymptomEntity);
        return patientSymptomMapper.toDto(savedEntity);
    }

    public PatientSymptomDto updatePatientSymptom(String id, PatientSymptomDto patientSymptomDto) {
        PatientSymptomEntity patientSymptom = patientSymptomRepository.findById(UUID.fromString(id))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "PatientSymptom not found")
                );

        // Update fields
        
        PatientEntity patient = patientRepository.findById(patientSymptomDto.getPatient().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found: " + patientSymptomDto.getPatient().getId()
                ));
        
        patientSymptom.setPatient(patient);
        
        SymptomEntity symptom = symptomRepository.findById(patientSymptomDto.getSymptom().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Symptom not found: " + patientSymptomDto.getSymptom().getId()
                ));
        
        patientSymptom.setSymptom(symptom);

        PatientSymptomEntity updated = patientSymptomRepository.save(patientSymptom);

        return patientSymptomMapper.toDto(updated);
    }

    public void deletePatientSymptom(String id) {
        UUID uuid = UUID.fromString(id);

        if (!patientSymptomRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "PatientSymptom not found");
        }

        patientSymptomRepository.deleteById(uuid);
    }


}
