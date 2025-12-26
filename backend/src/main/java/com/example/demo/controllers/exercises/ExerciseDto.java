package com.example.demo.controllers.exercises;


import java.util.UUID;

public class ExerciseDto {
    private UUID id;
    private String name;
    private String notes;

    public ExerciseDto() {
    }

    public ExerciseDto(UUID id, String name, String notes) {
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