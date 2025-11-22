package com.example.demo.repository.exercises;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ExerciseRepository extends JpaRepository<ExerciseEntity, UUID> {
}
