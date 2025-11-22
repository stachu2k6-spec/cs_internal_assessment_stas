package com.example.demo.domains.meetings;


import com.example.demo.controllers.meetings.MeetingsDto;
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

    public List<MeetingsDto> getMeetings() {
        List<MeetingEntity> meetingRepositoryAll = this.meetingRepository.findAll();

        return meetingRepositoryAll
                .stream()
                .map(meetingMapper::toDto)
                .toList();
    }

    public MeetingsDto addMeetings(MeetingsDto meetingsDto) {
        MeetingEntity meetingEntity = this.meetingMapper.toEntity(meetingsDto);
        MeetingEntity savedEntity = this.meetingRepository.save(meetingEntity);
        return meetingMapper.toDto(savedEntity);
    }

    public MeetingsDto getMeetingsById(String id) {

        return meetingRepository.findById(UUID.fromString(id))
                .map(meetingMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));
    }

    public MeetingsDto updateMeeting(String id, MeetingsDto meetingsDto) {
        MeetingEntity meeting_not_found = meetingRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));

        meeting_not_found.setDate(meetingsDto.getDate());
        meeting_not_found.setTime(meetingsDto.getTime());
        meeting_not_found.setDuration(meetingsDto.getDuration());
        meeting_not_found.setNotes(meetingsDto.getNotes());

        MeetingEntity meetingEntity = meetingRepository.save(meeting_not_found);

        return meetingMapper.toDto(meetingEntity);
    }

    public void deleteMeeting(String id) {
        this.meetingRepository.deleteById(UUID.fromString(id));
    }
}
