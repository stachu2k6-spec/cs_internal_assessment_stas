package com.example.demo.repository.patientSymptom;

import com.example.demo.repository.patients.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientSymptomRepository extends JpaRepository<PatientSymptomEntity, UUID>, PatientSymptomRepositoryCustom {
}
