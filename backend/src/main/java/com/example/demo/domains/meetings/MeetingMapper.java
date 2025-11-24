package com.example.demo.domains.meetings;

import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.repository.meetings.MeetingEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MeetingMapper {

    public MeetingEntity toEntity(MeetingDto dto) {
        MeetingEntity entity = new MeetingEntity();

        // id z DTO może być null przy tworzeniu nowego pacjenta
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setDate(dto.getDate());
        entity.setTime(dto.getStartTime());
        entity.setDuration(dto.getDuration());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public MeetingDto toDto(MeetingEntity entity) {
        MeetingDto dto = new MeetingDto();

        dto.setId(entity.getId().toString());
        dto.setDate(entity.getDate());
        dto.setStartTime(entity.getTime());
        dto.setDuration(entity.getDuration());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
