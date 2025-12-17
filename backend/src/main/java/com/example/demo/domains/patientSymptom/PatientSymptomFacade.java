package com.example.demo.domains.patientSymptom;

import com.example.demo.controllers.patientSymptom.PatientSymptomDto;
import com.example.demo.repository.patientSymptom.PatientSymptomEntity;
import com.example.demo.repository.patientSymptom.PatientSymptomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PatientSymptomFacade {

    private final PatientSymptomRepository patientSymptomRepository;
    private final PatientSymptomMapper patientSymptomMapper;

    public PatientSymptomFacade(
            PatientSymptomRepository patientSymptomRepository,
            PatientSymptomMapper patientSymptomMapper
    ) {
        this.patientSymptomRepository = patientSymptomRepository;
        this.patientSymptomMapper = patientSymptomMapper;
    }

    /* ===================== GET ===================== */

    public List<PatientSymptomDto> getAll() {
        return patientSymptomRepository.findAll()
                .stream()
                .map(patientSymptomMapper::toDto)
                .toList();
    }

    public PatientSymptomDto getByKey(String patientId, String symptomId) {
        return patientSymptomRepository
                .findByPatientIdAndSymptomId(
                        UUID.fromString(patientId),
                        UUID.fromString(symptomId)
                )
                .map(patientSymptomMapper::toDto)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "PatientSymptom not found"
                        )
                );
    }

    /* ===================== CREATE ===================== */

    public PatientSymptomDto create(PatientSymptomDto dto) {
        PatientSymptomEntity entity =
                patientSymptomMapper.toEntity(dto);

        PatientSymptomEntity saved =
                patientSymptomRepository.save(entity);

        return patientSymptomMapper.toDto(saved);
    }

    /* ===================== UPDATE ===================== */

    public PatientSymptomDto update(
            String patientId,
            String symptomId,
            PatientSymptomDto dto
    ) {
        PatientSymptomEntity existing =
                patientSymptomRepository
                        .findByPatientIdAndSymptomId(
                                UUID.fromString(patientId),
                                UUID.fromString(symptomId)
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "PatientSymptom not found"
                                )
                        );

        // update only mutable fields
        existing.setSeverity(dto.getSeverity());

        PatientSymptomEntity updated =
                patientSymptomRepository.save(existing);

        return patientSymptomMapper.toDto(updated);
    }

    /* ===================== DELETE ===================== */

    public void delete(String patientId, String symptomId) {
        boolean exists =
                patientSymptomRepository.existsByPatientIdAndSymptomId(
                        UUID.fromString(patientId),
                        UUID.fromString(symptomId)
                );

        if (!exists) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "PatientSymptom not found"
            );
        }

        patientSymptomRepository.deleteByPatientIdAndSymptomId(
                UUID.fromString(patientId),
                UUID.fromString(symptomId)
        );
    }
}
