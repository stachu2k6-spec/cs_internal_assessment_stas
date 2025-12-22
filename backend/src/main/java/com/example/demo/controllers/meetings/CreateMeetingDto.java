package com.example.demo.controllers.meetings;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class CreateMeetingDto {
    private UUID patientId;
    private LocalDate dateTime;
    private int duration;
    private String notes;
    private double rating;

    public CreateMeetingDto() {
    }

    public CreateMeetingDto(String patientId, LocalDate dateTime, int duration, String notes, double rating) {
        this.patientId = UUID.fromString(patientId);
        this.dateTime = dateTime;
        this.duration = duration;
        this.notes = notes;
        this.rating = rating;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
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

