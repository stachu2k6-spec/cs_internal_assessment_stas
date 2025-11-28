package com.example.demo.repository.meetings;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MeetingRepository extends JpaRepository<MeetingEntity, UUID> {
    List<MeetingEntity> findByPatientId(String patientId);
}
