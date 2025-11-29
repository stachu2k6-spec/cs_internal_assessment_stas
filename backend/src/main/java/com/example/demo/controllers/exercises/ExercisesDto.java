package com.example.demo.controllers.exercises;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class ExercisesDto {
    private String id;
    private String name;
    private String notes;

    public ExercisesDto() {
    }

    public ExercisesDto(String id, String name, String notes) {
        this.id = id;
        this.name = name;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

