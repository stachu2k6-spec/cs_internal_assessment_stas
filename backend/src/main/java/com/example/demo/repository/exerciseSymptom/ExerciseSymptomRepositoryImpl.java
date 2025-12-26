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
                "SELECT ps FROM ExerciseSymptomEntity ps " +
                        "WHERE ps.exercise.id = :exerciseId " +
                        "AND ps.symptom.id = :symptomId";

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
                "SELECT ps FROM ExerciseSymptomEntity ps " +
                        "WHERE ps.exercise.id = :exerciseId";

        return entityManager.createQuery(query, ExerciseSymptomEntity.class)
                .setParameter("exerciseId", exerciseId)
                .getResultList();
    }
}
