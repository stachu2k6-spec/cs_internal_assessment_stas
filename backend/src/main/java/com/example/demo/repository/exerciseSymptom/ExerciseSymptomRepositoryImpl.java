package com.example.demo.repository.exerciseSymptom;

import com.example.demo.repository.exerciseSymptom.ExerciseSymptomEntity;
import com.example.demo.repository.exerciseSymptom.ExerciseSymptomRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class ExerciseSymptomRepositoryImpl
        implements ExerciseSymptomRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<ExerciseSymptomEntity> findByExerciseIdAndSymptomId(
            UUID exerciseId,
            UUID symptomId
    ) {
        String query =
                "SELECT es FROM ExerciseSymptomEntity es " +
                        "WHERE es.exercise.id = :exerciseId " +
                        "AND es.symptom.id = :symptomId";

        return entityManager.createQuery(query, ExerciseSymptomEntity.class)
                .setParameter("exerciseId", exerciseId)
                .setParameter("symptomId", symptomId)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Override
    public List<ExerciseSymptomEntity> findByExerciseId(UUID exerciseId) {
        String query =
                "SELECT es FROM ExerciseSymptomEntity es " +
                        "WHERE es.exercise.id = :exerciseId";

        return entityManager.createQuery(query, ExerciseSymptomEntity.class)
                .setParameter("exerciseId", exerciseId)
                .getResultList();
    }

    @Override
    public List<ExerciseSymptomEntity> findBySymptomId(UUID symptomId) {
        String query =
                "SELECT es FROM ExerciseSymptomEntity es " +
                        "WHERE es.symptom.id = :symptomId";

        return entityManager.createQuery(query, ExerciseSymptomEntity.class)
                .setParameter("symptomId", symptomId)
                .getResultList();
    }

    @Override
    public List<ExerciseSymptomEntity> findBySymptomIds(List<UUID> symptomIds) {
        String query =
                "SELECT es FROM ExerciseSymptomEntity es " +
                        "WHERE es.symptom.id IN :symptomIds";

        return entityManager.createQuery(query, ExerciseSymptomEntity.class)
                .setParameter("symptomIds", symptomIds)
                .getResultList();
    }
}
