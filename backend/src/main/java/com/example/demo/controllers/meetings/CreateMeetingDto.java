package com.example.demo.controllers.meetings;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class CreateMeetingDto {
    private UUID patientId;
    private LocalDate date;
    private LocalTime startTime;
    private Duration duration;
    private String notes;

    public CreateMeetingDto() {
    }

    public CreateMeetingDto(String patientId, LocalDate date, LocalTime startTime, Duration duration, String notes) {
        this.patientId = UUID.fromString(patientId);
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
        this.notes = notes;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public Duration getDuration() {
        return duration;
    }

    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

