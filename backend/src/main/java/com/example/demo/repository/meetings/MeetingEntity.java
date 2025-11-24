package com.example.demo.repository.meetings;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "meetings")
public class MeetingEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private LocalDate date;
    private LocalTime time;
    private Duration duration;
    private String notes;

    public MeetingEntity() {}
}
