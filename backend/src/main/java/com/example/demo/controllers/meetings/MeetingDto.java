package com.example.demo.controllers.meetings;

import com.example.demo.controllers.patients.PatientDto;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class MeetingDto {
    private UUID id;
    private PatientDto patient;
    private LocalDate dateTime;
    private int duration;
    private String notes;
    private double rating;

    public MeetingDto() {
    }

    public MeetingDto(String id,  PatientDto patient, LocalDate dateTime, int duration, String notes, double rating) {
        this.id = UUID.fromString(id);
        this.patient = patient;
        this.dateTime = dateTime;
        this.duration = duration;
        this.notes = notes;
        this.rating = rating;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public PatientDto getPatient() {
        return patient;
    }

    public void setPatient(PatientDto patient) {
        this.patient = patient;
    }

    public LocalDate getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDate dateTime) {
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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
