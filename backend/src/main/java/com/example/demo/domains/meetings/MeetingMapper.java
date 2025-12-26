package com.example.demo.domains.meetings;

import com.example.demo.controllers.exercises.ExerciseDto;
import com.example.demo.controllers.meetings.CreateMeetingDto;
import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.domains.patients.PatientMapper;
import com.example.demo.repository.exercises.ExerciseRepository;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.UUID;

@Service
public class MeetingMapper {

    private final PatientMapper patientMapper;
    private final PatientRepository patientRepository;
    private final ExerciseRepository exerciseRepository;

    public MeetingMapper(PatientMapper patientMapper, PatientRepository patientRepository, ExerciseRepository exerciseRepository) {
        this.patientMapper = patientMapper;
        this.patientRepository = patientRepository;
        this.exerciseRepository = exerciseRepository;
    }

    /**
     * Converts MeetingEntity → MeetingDto (Entity -> DTO)
     */
    public MeetingDto toDto(MeetingEntity entity) {
        if (entity == null) return null;

        MeetingDto dto = new MeetingDto();
        dto.setId(entity.getId());
        dto.setDateTime(entity.getDateTime());
        dto.setDuration(entity.getDuration());
        dto.setNotes(entity.getNotes());
        dto.setRating(entity.getRating());

        dto.setExercises(
                entity.getExercises().stream()
                        .map(e -> new ExerciseDto(e.getId(), e.getName(), e.getNotes()))
                        .toList()
        );

        // Convert PatientEntity -> PatientDto
        PatientDto patientDto = patientMapper.toDto(entity.getPatient());
        dto.setPatient(patientDto);

        return dto;
    }

    /**
     * Converts MeetingDto → MeetingEntity (DTO -> Entity)
     */
    public MeetingEntity toEntity(MeetingDto dto) {
        if (dto == null) return null;

        MeetingEntity entity = new MeetingEntity();

        entity.setId(dto.getId());
        entity.setDateTime(dto.getDateTime());
        entity.setDuration(dto.getDuration());
        entity.setNotes(dto.getNotes());
        entity.setRating(dto.getRating());

        entity.setExercises(
                new HashSet<>(
                        exerciseRepository.findAllById(
                                dto.getExercises().stream()
                                        .map(ExerciseDto::getId)
                                        .toList()
                        )
                )
        );

         PatientEntity p = patientRepository.findById(dto.getPatient().getId()).get();
         entity.setPatient(p);

        return entity;
    }

}
