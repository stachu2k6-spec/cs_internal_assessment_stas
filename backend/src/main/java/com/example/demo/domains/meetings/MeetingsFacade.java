package com.example.demo.domains.meetings;


import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.meetings.MeetingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class MeetingsFacade {

    private final MeetingRepository meetingRepository;
    private final MeetingMapper meetingMapper;

    public MeetingsFacade(MeetingRepository meetingRepository, MeetingMapper meetingMapper) {
        this.meetingRepository = meetingRepository;
        this.meetingMapper = meetingMapper;
    }

    public List<MeetingDto> getMeetings() {
        List<MeetingEntity> meetingRepositoryAll = this.meetingRepository.findAll();

        return meetingRepositoryAll
                .stream()
                .map(meetingMapper::toDto)
                .toList();
    }

    public MeetingDto getMeetingsById(String id) {

        return meetingRepository.findById(UUID.fromString(id))
                .map(meetingMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));
    }

    public List<MeetingDto> getMeetingsByPatientId(String patientId) {
        List<MeetingEntity> meetings = meetingRepository.findByPatientId(UUID.fromString(patientId));

        return meetings.stream()
                .map(meetingMapper::toDto)
                .toList();
    }

    public MeetingDto addMeetings(MeetingDto meetingDto) {
        MeetingEntity meetingEntity = this.meetingMapper.toEntity(meetingDto);
        MeetingEntity savedEntity = this.meetingRepository.save(meetingEntity);
        return meetingMapper.toDto(savedEntity);
    }

    public MeetingDto updateMeeting(String id, MeetingDto meetingDto) {
        MeetingEntity meeting_not_found = meetingRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));

//        meeting_not_found.setPatientId(meetingDto.getPatientId());
        meeting_not_found.setDate(meetingDto.getDate());
        meeting_not_found.setTime(meetingDto.getStartTime());
        meeting_not_found.setDuration(meetingDto.getDuration());
        meeting_not_found.setNotes(meetingDto.getNotes());

        MeetingEntity meetingEntity = meetingRepository.save(meeting_not_found);

        return meetingMapper.toDto(meetingEntity);
    }

    public void deleteMeeting(String id) {
        this.meetingRepository.deleteById(UUID.fromString(id));
    }
}
