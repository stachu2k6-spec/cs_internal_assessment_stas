package com.example.demo.controllers.symptoms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SymptomsDto {
    private String id;
    private String name;
    private String notes;
}
