package com.example.demo.domains.meetings;

import com.example.demo.controllers.meetings.CreateMeetingDto;
import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.domains.patients.PatientMapper;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.patients.PatientEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MeetingMapper {

    private final PatientMapper patientMapper;

    public MeetingMapper(PatientMapper patientMapper) {
        this.patientMapper = patientMapper;
    }

    /**
     * Converts MeetingEntity → MeetingDto (Entity -> DTO)
     */
    public MeetingDto toDto(MeetingEntity entity) {
        if (entity == null) return null;

        MeetingDto dto = new MeetingDto();
        dto.setId(entity.getId());
        dto.setDate(entity.getDate());
        dto.setStartTime(entity.getStartTime());
        dto.setDuration(entity.getDuration());
        dto.setNotes(entity.getNotes());

        // Convert PatientEntity -> PatientDto
        PatientDto patientDto = patientMapper.toDto(entity.getPatient());
        dto.setPatient(patientDto);

        return dto;
    }

    /**
     * Converts MeetingDto → MeetingEntity (DTO -> Entity)
     *
     * NOTE: PatientEntity is NOT taken from MeetingDto directly, because MeetingDto contains a PatientDto.
     * The service must fetch PatientEntity from DB and inject it afterward.
     */
    public MeetingEntity toEntity(MeetingDto dto) {
        if (dto == null) return null;

        MeetingEntity entity = new MeetingEntity();

        entity.setId(dto.getId());
        entity.setDate(dto.getDate());
        entity.setStartTime(dto.getStartTime());
        entity.setDuration(dto.getDuration());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    /**
     * Helper method for CreateMeetingDto → MeetingEntity for the create flow.
     */
    public MeetingEntity fromCreate(CreateMeetingDto dto) {
        MeetingEntity entity = new MeetingEntity();
        entity.setId(UUID.randomUUID());
        entity.setDate(dto.getDate());
        entity.setStartTime(dto.getStartTime());
        entity.setDuration(dto.getDuration());
        entity.setNotes(dto.getNotes());
        return entity;
    }
}
