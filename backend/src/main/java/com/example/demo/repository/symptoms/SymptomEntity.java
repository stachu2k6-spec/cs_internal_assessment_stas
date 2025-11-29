package com.example.demo.repository.symptoms;

import com.example.demo.repository.patients.PatientEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Entity
@Table(name = "symptoms")
public class SymptomEntity {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private String notes;
    @ManyToMany(mappedBy = "symptoms", fetch = FetchType.LAZY)
    private Set<PatientEntity> patients = new HashSet<>();

    public SymptomEntity() {
    }

    public SymptomEntity(UUID id, String name, String notes) {
        this.id = id;
        this.name = name;
        this.notes = notes;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
