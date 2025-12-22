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
    private Duration duration;
    private String notes;

    public MeetingDto() {
    }

    public MeetingDto(String id,  PatientDto patient, LocalDate dateTime, Duration duration, String notes) {
        this.id = UUID.fromString(id);
        this.patient = patient;
        this.dateTime = dateTime;
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

    public LocalDate getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDate dateTime) {
        this.dateTime = dateTime;
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
