package com.example.demo.repository.exerciseSymptom;

import com.example.demo.repository.exerciseSymptom.ExerciseSymptomEntity;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExerciseSymptomRepositoryCustom {
    Optional<ExerciseSymptomEntity> findByExerciseIdAndSymptomId(
            UUID exerciseId,
            UUID symptomId
    );

    List<ExerciseSymptomEntity> findByExerciseId(UUID exerciseId);

    List<ExerciseSymptomEntity> findBySymptomId(UUID symptomId);

    List<ExerciseSymptomEntity> findBySymptomIds(List<UUID> symptomIds);
}
