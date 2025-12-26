package com.example.demo.repository.exerciseSymptom;


import com.example.demo.repository.exercises.ExerciseEntity;
import com.example.demo.repository.symptoms.SymptomEntity;
import jakarta.persistence.*;

import java.util.UUID;


@Entity
@Table(name = "exerciseSymptoms")
public class ExerciseSymptomEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "exercise")
    private ExerciseEntity exercise;

    @ManyToOne
    @JoinColumn(name = "symptom")
    private SymptomEntity symptom;

    private int effectiveness;

    public ExerciseSymptomEntity() {}

    public ExerciseEntity getExercise() {
        return exercise;
    }

    public void setExercise(ExerciseEntity exercise) {
        this.exercise = exercise;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public SymptomEntity getSymptom() {
        return symptom;
    }

    public void setSymptom(SymptomEntity symptom) {
        this.symptom = symptom;
    }

    public int getEffectiveness() {
        return effectiveness;
    }

    public void setEffectiveness(int effectiveness) {
        this.effectiveness = effectiveness;
    }
}


