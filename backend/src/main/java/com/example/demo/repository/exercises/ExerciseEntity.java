package com.example.demo.repository.exercises;

import com.example.demo.repository.meetings.MeetingEntity;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Entity
@Table(name = "exercises")
public class ExerciseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToMany(mappedBy = "exercises")
    private Set<MeetingEntity> meetings = new HashSet<>();

    private String name;
    private String notes;



    public ExerciseEntity() {}

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

    public Set<MeetingEntity> getMeetings() {
        return meetings;
    }

    public void setMeetings(Set<MeetingEntity> meetings) {
        this.meetings = meetings;
    }
}