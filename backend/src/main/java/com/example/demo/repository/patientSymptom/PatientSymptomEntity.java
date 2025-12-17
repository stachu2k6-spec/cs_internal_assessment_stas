package com.example.demo.repository.patientSymptom;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;


@Entity
@Table(name = "patientSymptoms")
public class PatientSymptomEntity {

    @Id
    private UUID patientId;
    private UUID symptomId;
    private int severity;

    public PatientSymptomEntity() {}


    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public UUID getSymptomId() {
        return symptomId;
    }

    public void setSymptomId(UUID symptomId) {
        this.symptomId = symptomId;
    }

    public int getSeverity() {
        return severity;
    }

    public void setSeverity(int severity) {
        this.severity = severity;
    }
}


