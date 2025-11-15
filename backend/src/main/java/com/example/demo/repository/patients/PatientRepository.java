package com.example.demo.repository.patients;

import com.example.demo.repository.patients.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {
}
