package com.example.demo.repository.patientSymptom;

import java.util.Optional;
import java.util.UUID;

public interface PatientSymptomRepositoryCustom {
    Optional<PatientSymptomEntity> findByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    );

    boolean existsByPatientIdAndSymptomId (UUID patientId, UUID symptomId);

    void deleteByPatientIdAndSymptomId (UUID patientId, UUID symptomId);
}
