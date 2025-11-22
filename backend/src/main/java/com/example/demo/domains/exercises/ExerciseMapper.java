package com.example.demo.domains.exercises;

import com.example.demo.controllers.exercises.ExercisesDto;
import com.example.demo.repository.exercises.ExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ExerciseMapper {

    public ExerciseEntity toEntity(ExercisesDto dto) {
        ExerciseEntity entity = new ExerciseEntity();

        // id z DTO może być null przy tworzeniu nowego pacjenta
        if (dto.getId() != null && !dto.getId().isEmpty()) {
            entity.setId(UUID.fromString(dto.getId()));
        }

        entity.setName(dto.getName());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public ExercisesDto toDto(ExerciseEntity entity) {
        ExercisesDto dto = new ExercisesDto();

        dto.setId(entity.getId().toString());
        dto.setName(entity.getName());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
