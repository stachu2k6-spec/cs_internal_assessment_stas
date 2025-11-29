package com.example.demo.controllers.meetings;

import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.repository.patients.PatientEntity;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class MeetingDto {
    private UUID id;
    private PatientDto patient;
    private LocalDate date;
    private LocalTime startTime;
    private Duration duration;
    private String notes;

    public MeetingDto() {
    }

    public MeetingDto(String id,  PatientDto patient, LocalDate date, LocalTime startTime, Duration duration, String notes) {
        this.id = UUID.fromString(id);
        this.patient = patient;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
        this.notes = notes;
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
