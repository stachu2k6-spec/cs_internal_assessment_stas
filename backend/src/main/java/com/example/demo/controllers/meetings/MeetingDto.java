package com.example.demo.controllers.meetings;

import com.example.demo.controllers.patients.PatientDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

public class MeetingDto {
    private String id;
    private PatientDto patientId;
    private LocalDate date;
    private LocalTime startTime;
    private Duration duration;
    private String notes;

    public MeetingDto() {
    }

    public MeetingDto(String id,  LocalDate date, LocalTime startTime, Duration duration, String notes) {
        this.id = id;
//        this.patientId = patientId;
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public PatientDto getPatientId() {
        return patientId;
    }

    public void setPatientId(PatientDto patientId) {
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
