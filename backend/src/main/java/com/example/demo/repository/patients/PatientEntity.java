package com.example.demo.repository.patients;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String surname;
    private String gender;

    private LocalDate birthDate;

    private String address;
    private String phoneNumber;
    private String email;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String activityLevel;

    private String photoUrl;

    public PatientEntity() {}

}
