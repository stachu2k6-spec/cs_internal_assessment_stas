package com.example.demo.domains.exercises;

import com.example.demo.controllers.exercises.ExerciseDto;
import com.example.demo.repository.exercises.ExerciseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ExerciseMapper {

    public ExerciseEntity toEntity(ExerciseDto dto) {
        ExerciseEntity entity = new ExerciseEntity();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }

        entity.setName(dto.getName());
        entity.setNotes(dto.getNotes());

        return entity;
    }

    public ExerciseDto toDto(ExerciseEntity entity) {
        ExerciseDto dto = new ExerciseDto();

        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setNotes(entity.getNotes());

        return dto;
    }
}
