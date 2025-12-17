package com.example.demo.repository.patientSymptom;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public class PatientSymptomRepositoryImpl
        implements PatientSymptomRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<PatientSymptomEntity> findByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    ) {
        String query = "SELECT ps FROM PatientSymptomEntity ps " +
                        "WHERE ps.patientId = :patientId " +
                        "AND ps.symptomId = :symptomId";

        return entityManager.createQuery(query, PatientSymptomEntity.class)
                        .setParameter("patientId", patientId)
                        .setParameter("symptomId", symptomId)
                        .getResultList()
                    .stream()
                    .findFirst();
    }

    @Override
    public boolean existsByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    ) {
        String jpql =
                "SELECT COUNT(ps) FROM PatientSymptomEntity ps " +
                        "WHERE ps.patientId = :patientId " +
                        "AND ps.symptomId = :symptomId";

        Long count =
                entityManager.createQuery(jpql, Long.class)
                        .setParameter("patientId", patientId)
                        .setParameter("symptomId", symptomId)
                        .getSingleResult();

        return count > 0;
    }

    @Override
    public void deleteByPatientIdAndSymptomId(
            UUID patientId,
            UUID symptomId
    ) {
        String jpql =
                "DELETE FROM PatientSymptomEntity ps " +
                        "WHERE ps.patientId = :patientId " +
                        "AND ps.symptomId = :symptomId";

        entityManager.createQuery(jpql)
                .setParameter("patientId", patientId)
                .setParameter("symptomId", symptomId)
                .executeUpdate();
    }
}

