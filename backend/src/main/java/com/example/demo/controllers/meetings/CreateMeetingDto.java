package com.example.demo.controllers.meetings;


import com.example.demo.controllers.exercises.ExerciseDto;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public class CreateMeetingDto {
    private UUID patientId;
    private LocalDateTime dateTime;
    private int duration;
    private String notes;
    private int rating;
    private List<ExerciseDto> exercises;

    public CreateMeetingDto() {
    }

    public CreateMeetingDto(String patientId, LocalDateTime dateTime, int duration, String notes, int rating, List<ExerciseDto> exercises) {
        this.patientId = UUID.fromString(patientId);
        this.dateTime = dateTime;
        this.duration = duration;
        this.notes = notes;
        this.rating = rating;
        this.exercises = exercises;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public List<ExerciseDto> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseDto> exercises) {
        this.exercises = exercises;
    }
}

