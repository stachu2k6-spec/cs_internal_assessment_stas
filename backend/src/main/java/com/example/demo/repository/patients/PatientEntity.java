package com.example.demo.repository.patients;
import jakarta.persistence.*;

import java.util.UUID;


@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String surname;
    private String address;
    private String notes;

    public PatientEntity() {}

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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
