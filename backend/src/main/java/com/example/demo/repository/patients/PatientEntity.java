package com.example.demo.repository.patients;

import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.symptoms.SymptomEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    @GeneratedValue
    private UUID id;

    private String name;
    private String surname;
    private String gender;

    private LocalDate birthDate;

    private String address;
    private String phoneNumber;
    private String email;

    private String notes;
    private String activityLevel;

    private String photoUrl;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "patient")
    @Fetch(value = FetchMode.SUBSELECT)
    private Set<MeetingEntity> meetings;

//    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
//    @JoinTable(name = "PATIENT_BELONG_SYMPTOM",
//            joinColumns = {@JoinColumn(name = "symptomId")},
//            inverseJoinColumns = {@JoinColumn(name = "patientId")})
//    private Set<SymptomEntity> symptoms;


    public PatientEntity() {}

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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public Set<MeetingEntity> getMeetings() {
        return meetings;
    }

    public void setMeetings(Set<MeetingEntity> meetings) {
        this.meetings = meetings;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

//    public Set<SymptomEntity> getSymptoms() {
//        return symptoms;
//    }
//
//    public void setSymptoms(Set<SymptomEntity> symptoms) {
//        this.symptoms = symptoms;
//    }
}