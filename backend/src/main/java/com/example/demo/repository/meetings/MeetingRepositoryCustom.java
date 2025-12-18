package com.example.demo.repository.meetings;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface MeetingRepositoryCustom {
    List<MeetingEntity> getPatientMeetingsById(UUID patientId);

    List<MeetingEntity> getMonthMeetings(int year, int month);
}