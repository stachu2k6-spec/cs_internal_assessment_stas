package com.example.demo.domains.exercises;


import com.example.demo.controllers.exercises.ExercisesDto;
import com.example.demo.repository.exercises.ExerciseEntity;
import com.example.demo.repository.exercises.ExerciseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ExercisesFacade {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    public ExercisesFacade(ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
    }

    public List<ExercisesDto> getExercises() {
        List<ExerciseEntity> exerciseRepositoryAll = this.exerciseRepository.findAll();

        return exerciseRepositoryAll
                .stream()
                .map(exerciseMapper::toDto)
                .toList();
    }

    public ExercisesDto addExercises(ExercisesDto exercisesDto) {
        ExerciseEntity exerciseEntity = this.exerciseMapper.toEntity(exercisesDto);
        ExerciseEntity savedEntity = this.exerciseRepository.save(exerciseEntity);
        return exerciseMapper.toDto(savedEntity);
    }

    public ExercisesDto getExercisesById(String id) {

        return exerciseRepository.findById(UUID.fromString(id))
                .map(exerciseMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));
    }

    public ExercisesDto updateExercise(String id, ExercisesDto exercisesDto) {
        ExerciseEntity exercise_not_found = exerciseRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exercise not found"));

        exercise_not_found.setName(exercisesDto.getName());
        exercise_not_found.setNotes(exercisesDto.getNotes());

        ExerciseEntity exerciseEntity = exerciseRepository.save(exercise_not_found);

        return exerciseMapper.toDto(exerciseEntity);
    }

    public void deleteExercise(String id) {
        this.exerciseRepository.deleteById(UUID.fromString(id));
    }
}
