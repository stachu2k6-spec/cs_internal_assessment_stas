package com.example.demo.repository.exerciseSymptom;

import com.example.demo.repository.patientSymptom.PatientSymptomEntity;
import com.example.demo.repository.patientSymptom.PatientSymptomRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExerciseSymptomRepository extends JpaRepository<ExerciseSymptomEntity, UUID>, ExerciseSymptomRepositoryCustom {
}
