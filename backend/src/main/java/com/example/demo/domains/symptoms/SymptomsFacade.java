package com.example.demo.domains.symptoms;


import com.example.demo.controllers.symptoms.SymptomDto;
import com.example.demo.repository.symptoms.SymptomEntity;
import com.example.demo.repository.symptoms.SymptomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class SymptomsFacade {

    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;

    public SymptomsFacade(SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    public List<SymptomDto> getSymptoms() {
        List<SymptomEntity> symptomRepositoryAll = this.symptomRepository.findAll();

        return symptomRepositoryAll
                .stream()
                .map(symptomMapper::toDto)
                .toList();
    }

    public SymptomDto addSymptoms(SymptomDto symptomsDto) {
        SymptomEntity symptomEntity = this.symptomMapper.toEntity(symptomsDto);
        SymptomEntity savedEntity = this.symptomRepository.save(symptomEntity);
        return symptomMapper.toDto(savedEntity);
    }

    public SymptomDto getSymptomsById(String id) {

        return symptomRepository.findById(UUID.fromString(id))
                .map(symptomMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Symptom not found"));
    }

    public SymptomDto updateSymptom(String id, SymptomDto symptomsDto) {
        SymptomEntity symptom_not_found = symptomRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Symptom not found"));

        symptom_not_found.setName(symptomsDto.getName());
        symptom_not_found.setNotes(symptomsDto.getNotes());

        SymptomEntity symptomEntity = symptomRepository.save(symptom_not_found);

        return symptomMapper.toDto(symptomEntity);
    }

    public void deleteSymptom(String id) {
        this.symptomRepository.deleteById(UUID.fromString(id));
    }
}
