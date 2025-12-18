package com.example.demo.domains.exercises;


import com.example.demo.controllers.exercises.ExerciseDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.repository.exercises.ExerciseEntity;
import com.example.demo.repository.exercises.ExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ExerciseFacade {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    public ExerciseFacade(ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
    }

    public List<ExerciseDto> getExercises() {
        List<ExerciseEntity> exerciseRepositoryAll = this.exerciseRepository.findAll();

        return exerciseRepositoryAll
                .stream()
                .map(exerciseMapper::toDto)
                .toList();
    }

    public ExerciseDto addExercises(ExerciseDto exerciseDto) {
        ExerciseEntity exerciseEntity = this.exerciseMapper.toEntity(exerciseDto);
        ExerciseEntity savedEntity = this.exerciseRepository.save(exerciseEntity);
        return exerciseMapper.toDto(savedEntity);
    }

    public ExerciseDto getExercisesById(String id) {

        return exerciseRepository.findById(UUID.fromString(id))
                .map(exerciseMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    public ExerciseDto updateExercise(String id, ExerciseDto exerciseDto) {
        ExerciseEntity exercise_not_found = exerciseRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        exercise_not_found.setName(exerciseDto.getName());
        exercise_not_found.setNotes(exerciseDto.getNotes());

        ExerciseEntity exerciseEntity = exerciseRepository.save(exercise_not_found);

        return exerciseMapper.toDto(exerciseEntity);
    }

    public void deleteExercise(String id) {
        UUID uuid = UUID.fromString(id);

        if (!exerciseRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        exerciseRepository.deleteById(uuid);
    }
}
