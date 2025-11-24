package com.example.demo.controllers.patients;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientDto {
    private String id;
    private String name;
    private String surname;
    private LocalDate birthDate;
    private String gender;
    private String address;
    private String phoneNumber;
    private String email;
    private String notes;
    private String activityLevel;
    private String photoUrl;
}
