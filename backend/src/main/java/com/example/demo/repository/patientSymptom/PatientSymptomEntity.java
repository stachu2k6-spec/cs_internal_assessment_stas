package com.example.demo.repository.patientSymptom;


import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.symptoms.SymptomEntity;
import jakarta.persistence.*;

import java.util.UUID;


@Entity
@Table(name = "patientSymptoms")
public class PatientSymptomEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "patient")
    private PatientEntity patient;

    @ManyToOne
    @JoinColumn(name = "symptom")
    private SymptomEntity symptom;
    private int severity;

    public PatientSymptomEntity() {}

    public PatientEntity getPatient() {
        return patient;
    }

    public void setPatient(PatientEntity patient) {
        this.patient = patient;
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

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }
}


