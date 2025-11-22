package com.example.demo.controllers.patients;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PatientsDto {
    private String id;
    private String name;
    private String surname;
    private String address;
    private String notes;
}
