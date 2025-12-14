package com.example.demo.repository.meetings;

import java.util.List;

public interface MeetingRepositoryCustom {
    List<MeetingEntity> getPatientMeetingsById(String patientId);

}
