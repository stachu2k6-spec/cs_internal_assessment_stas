package com.example.demo.controllers.exerciseSymptom;

import com.example.demo.controllers.exercises.ExerciseDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.controllers.symptoms.SymptomDto;

import java.util.UUID;

public class ExerciseSymptomDto {
    private UUID id;
    private ExerciseDto exercise;
    private SymptomDto symptom;
    private int effectiveness;

    public ExerciseSymptomDto() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ExerciseDto getExercise() {
        return exercise;
    }

    public void setExercise(ExerciseDto exercise) {
        this.exercise = exercise;
    }

    public SymptomDto getSymptom() {
        return symptom;
    }

    public void setSymptom(SymptomDto symptom) {
        this.symptom = symptom;
    }

    public int getEffectiveness() {
        return effectiveness;
    }

    public void setEffectiveness(int effectiveness) {
        this.effectiveness = effectiveness;
    }
}
