package com.example.demo.repository.symptoms;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "symptoms")
public class SymptomEntity {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private String notes;

    public SymptomEntity() {}

}
