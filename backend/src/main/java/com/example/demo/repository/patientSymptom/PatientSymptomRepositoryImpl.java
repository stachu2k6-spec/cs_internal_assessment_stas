package com.example.demo.repository.patientSymptom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class PatientSymptomRepositoryImpl
        implements PatientSymptomRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<PatientSymptomEntity> findByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    ) {
        String query =
                "SELECT ps FROM PatientSymptomEntity ps " +
                        "WHERE ps.patient.id = :patientId " +
                        "AND ps.symptom.id = :symptomId";

        return entityManager.createQuery(query, PatientSymptomEntity.class)
                .setParameter("patientId", patientId)
                .setParameter("symptomId", symptomId)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Override
    public List<PatientSymptomEntity> findByPatientId(UUID patientId) {
        String query =
                "SELECT ps FROM PatientSymptomEntity ps " +
                        "WHERE ps.patient.id = :patientId";

        return entityManager.createQuery(query, PatientSymptomEntity.class)
                .setParameter("patientId", patientId)
                .getResultList();
    }
}
