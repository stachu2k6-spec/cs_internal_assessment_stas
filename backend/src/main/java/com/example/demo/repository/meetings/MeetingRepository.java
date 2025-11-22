package com.example.demo.repository.meetings;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MeetingRepository extends JpaRepository<MeetingEntity, UUID> {
}
