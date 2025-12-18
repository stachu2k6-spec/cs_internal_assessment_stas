package com.example.demo.controllers.patientSymptom;

import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.controllers.symptoms.SymptomDto;

import java.util.UUID;

public class PatientSymptomDto {
    private UUID id;
    private PatientDto patient;
    private SymptomDto symptom;
    private int severity;

    public PatientSymptomDto() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PatientDto getPatient() {
        return patient;
    }

    public void setPatient(PatientDto patient) {
        this.patient = patient;
    }

    public SymptomDto getSymptom() {
        return symptom;
    }

    public void setSymptom(SymptomDto symptom) {
        this.symptom = symptom;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }
}
