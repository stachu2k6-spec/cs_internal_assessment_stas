package com.example.demo.controllers.symptoms;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

public class SymptomDto {
    private UUID id;
    private String name;
    private String notes;



    public SymptomDto(UUID id, String name, String notes) {
        this.id = id;
        this.name = name;
        this.notes = notes;
    }

    public SymptomDto() {
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
