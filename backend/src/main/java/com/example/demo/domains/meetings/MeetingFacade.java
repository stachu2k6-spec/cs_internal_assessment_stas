package com.example.demo.domains.meetings;

import com.example.demo.controllers.meetings.CreateMeetingDto;
import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.meetings.MeetingRepository;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MeetingFacade {

    private final MeetingRepository meetingRepository;
    private final PatientRepository patientRepository;
    private final MeetingMapper meetingMapper;

    public MeetingFacade(MeetingRepository meetingRepository,
                         PatientRepository patientRepository,
                         MeetingMapper meetingMapper) {
        this.meetingRepository = meetingRepository;
        this.patientRepository = patientRepository;
        this.meetingMapper = meetingMapper;
    }

    public List<MeetingDto> getMeetings() {
        List<MeetingEntity> meetingEntities = this.meetingRepository.findAll();

        return meetingEntities
                .stream()
                .map(meetingMapper::toDto)
                .toList();
    }

    public MeetingDto getMeetingById(String id) {
        return meetingRepository.findById(UUID.fromString(id))
                .map(meetingMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));
    }


    @Transactional
    public MeetingDto createMeeting(CreateMeetingDto dto) {

        // 1. Fetch the PatientEntity from DB
        PatientEntity patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Patient not found: " + dto.getPatientId()
                ));

        // 2. Convert DTO → Entity (without patient)
        MeetingEntity meeting = new MeetingEntity();
        meeting.setDate(dto.getDate());
        meeting.setStartTime(dto.getStartTime());
        meeting.setDuration(dto.getDuration());
        meeting.setNotes(dto.getNotes());

        // 3. Attach the PatientEntity
        meeting.setPatient(patient);

        // 4. Save
        MeetingEntity saved = meetingRepository.save(meeting);

        // 5. Convert Entity → MeetingDto (includes PatientDto) via injected mapper
        return meetingMapper.toDto(saved);
    }

    @Transactional
    public MeetingDto updateMeeting(String id, MeetingDto meetingDto) {
        MeetingEntity meeting = meetingRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));


        PatientEntity patient = patientRepository.findById(meetingDto.getPatient().getId())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Patient not found: " + meetingDto.getPatient().getId()
        ));

        meeting.setPatient(patient);
        meeting.setDate(meetingDto.getDateTime());
        meeting.setStartTime(meetingDto.getStartTime());
        meeting.setDuration(meetingDto.getDuration());
        meeting.setNotes(meetingDto.getNotes());

        MeetingEntity saved = meetingRepository.save(meeting);

        return meetingMapper.toDto(saved);
    }

    public void deleteMeeting(String id) {
        UUID uuid = UUID.fromString(id);

        if (!meetingRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found");
        }

        this.meetingRepository.deleteById(UUID.fromString(id));
    }

    public List<MeetingDto> getPatientMeetingsById(String patientId) {
        UUID uuid = UUID.fromString(patientId);

        return meetingRepository.getPatientMeetingsById(uuid)
                .stream()
                .map(meetingMapper::toDto)
                .collect(Collectors.toList());


    }

    public List<MeetingDto> getMonthMeetings(int year, int month) {
        return meetingRepository.getMonthMeetings(year, month)
                .stream()
                .map(meetingMapper::toDto)
                .collect(Collectors.toList());
    }
}
