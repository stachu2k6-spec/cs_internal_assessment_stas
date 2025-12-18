package com.example.demo.repository.patientSymptom;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientSymptomRepositoryCustom {
    Optional<PatientSymptomEntity> findByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    );

    List<PatientSymptomEntity> findByPatientId(UUID patientId);

}
