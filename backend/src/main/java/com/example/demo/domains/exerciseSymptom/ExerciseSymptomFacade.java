package com.example.demo.domains.exerciseSymptom;

import com.example.demo.controllers.exerciseSymptom.ExerciseSymptomDto;
import com.example.demo.domains.exerciseSymptom.ExerciseSymptomMapper;
import com.example.demo.domains.exercises.ExerciseMapper;
import com.example.demo.domains.symptoms.SymptomMapper;
import com.example.demo.repository.exerciseSymptom.ExerciseSymptomEntity;
import com.example.demo.repository.exerciseSymptom.ExerciseSymptomRepository;
import com.example.demo.repository.exercises.ExerciseEntity;
import com.example.demo.repository.exercises.ExerciseRepository;
import com.example.demo.repository.symptoms.SymptomEntity;
import com.example.demo.repository.symptoms.SymptomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class ExerciseSymptomFacade {

    private final ExerciseSymptomRepository exerciseSymptomRepository;
    private final ExerciseSymptomMapper exerciseSymptomMapper;
    
    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    
    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;

    public ExerciseSymptomFacade(ExerciseSymptomRepository exerciseSymptomRepository, ExerciseSymptomMapper exerciseSymptomMapper, ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper, SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.exerciseSymptomRepository = exerciseSymptomRepository;
        this.exerciseSymptomMapper = exerciseSymptomMapper;
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    public List<ExerciseSymptomDto> getExerciseSymptoms() {
        return exerciseSymptomRepository.findAll()
                .stream()
                .map(exerciseSymptomMapper::toDto)
                .toList();
    }

    public ExerciseSymptomDto getExerciseSymptomById(String id) {
        return exerciseSymptomRepository.findById(UUID.fromString(id))
                .map(exerciseSymptomMapper::toDto)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "ExerciseSymptom not found")
                );
    }

    public List<ExerciseSymptomDto> getExerciseSymptomsByExerciseId(String exerciseId) {
        return exerciseSymptomRepository.findByExerciseId(UUID.fromString(exerciseId))
                .stream()
                .map(exerciseSymptomMapper::toDto)
                .toList();
    }

    public List<ExerciseSymptomDto> getExerciseSymptomsBySymptomId(String symptomId) {
        return exerciseSymptomRepository.findBySymptomId(UUID.fromString(symptomId))
                .stream()
                .map(exerciseSymptomMapper::toDto)
                .toList();
    }

    public List<ExerciseSymptomDto> getExerciseSymptomsBySymptomIds(List<String> symptomIds) {
        List<UUID> symptomUuids = symptomIds.stream()
                .map(UUID::fromString)
                .toList();

        return exerciseSymptomRepository.findBySymptomIds(symptomUuids)
                .stream()
                .map(exerciseSymptomMapper::toDto)
                .toList();
    }

    public ExerciseSymptomDto addExerciseSymptom(ExerciseSymptomDto exerciseSymptomDto) {
        ExerciseSymptomEntity exerciseSymptomEntity = exerciseSymptomMapper.toEntity(exerciseSymptomDto);
        ExerciseSymptomEntity savedEntity = exerciseSymptomRepository.save(exerciseSymptomEntity);
        return exerciseSymptomMapper.toDto(savedEntity);
    }

    public ExerciseSymptomDto updateExerciseSymptom(String id, ExerciseSymptomDto exerciseSymptomDto) {
        ExerciseSymptomEntity exerciseSymptom = exerciseSymptomRepository.findById(UUID.fromString(id))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "ExerciseSymptom not found")
                );

        // Update fields
        exerciseSymptom.setEffectiveness(exerciseSymptomDto.getEffectiveness());
        
        ExerciseEntity exercise = exerciseRepository.findById(exerciseSymptomDto.getExercise().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Exercise not found: " + exerciseSymptomDto.getExercise().getId()
                ));
        
        exerciseSymptom.setExercise(exercise);
        
        SymptomEntity symptom = symptomRepository.findById(exerciseSymptomDto.getSymptom().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Symptom not found: " + exerciseSymptomDto.getSymptom().getId()
                ));
        
        exerciseSymptom.setSymptom(symptom);

        ExerciseSymptomEntity updated = exerciseSymptomRepository.save(exerciseSymptom);

        return exerciseSymptomMapper.toDto(updated);
    }

    public ExerciseSymptomDto[] updateExerciseSymptoms(ExerciseSymptomDto[] exerciseSymptoms) {
        return Arrays.stream(exerciseSymptoms)
                .map(dto -> updateExerciseSymptom(dto.getId().toString(), dto))
                .toArray(ExerciseSymptomDto[]::new);
    }

    public void deleteExerciseSymptom(String id) {
        UUID uuid = UUID.fromString(id);

        if (!exerciseSymptomRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ExerciseSymptom not found");
        }

        exerciseSymptomRepository.deleteById(uuid);
    }



}
