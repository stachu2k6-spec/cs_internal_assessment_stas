package com.example.demo.domains.meetings;

import com.example.demo.controllers.meetings.MeetingsDto;
import com.example.demo.repository.meetings.MeetingEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MeetingMapper {

    public MeetingEntity toEntity(MeetingsDto dto) {
        MeetingEntity entity = new MeetingEntity();

        // id z DTO może być null przy tworzeniu nowego pacjenta
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setDate(dto.getDate());
        entity.setTime(dto.getTime());
        entity.setDuration(dto.getDuration());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public MeetingsDto toDto(MeetingEntity entity) {
        MeetingsDto dto = new MeetingsDto();

        dto.setId(entity.getId().toString());
        dto.setDate(entity.getDate());
        dto.setTime(entity.getTime());
        dto.setDuration(entity.getDuration());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
