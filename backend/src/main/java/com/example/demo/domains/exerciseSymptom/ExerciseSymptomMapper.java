package com.example.demo.domains.exerciseSymptom;

import com.example.demo.controllers.exerciseSymptom.ExerciseSymptomDto;
import com.example.demo.controllers.exercises.ExerciseDto;
import com.example.demo.controllers.symptoms.SymptomDto;
import com.example.demo.domains.exercises.ExerciseMapper;
import com.example.demo.domains.symptoms.SymptomMapper;
import com.example.demo.repository.exerciseSymptom.ExerciseSymptomEntity;
import com.example.demo.repository.exercises.ExerciseEntity;
import com.example.demo.repository.exercises.ExerciseRepository;
import com.example.demo.repository.symptoms.SymptomEntity;
import com.example.demo.repository.symptoms.SymptomRepository;
import org.springframework.stereotype.Service;

@Service
public class ExerciseSymptomMapper {

    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    private final SymptomRepository symptomRepository;
    private final SymptomMapper symptomMapper;
    
    public ExerciseSymptomMapper(ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper, SymptomRepository symptomRepository, SymptomMapper symptomMapper) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
        this.symptomRepository = symptomRepository;
        this.symptomMapper = symptomMapper;
    }

    public ExerciseSymptomEntity toEntity(ExerciseSymptomDto dto) {
        ExerciseSymptomEntity entity = new ExerciseSymptomEntity();

        ExerciseEntity p = exerciseRepository.findById(dto.getExercise().getId()).get();
        entity.setExercise(p);
        
        SymptomEntity s = symptomRepository.findById(dto.getSymptom().getId()).get();
        entity.setSymptom(s);

        entity.setEffectiveness(dto.getEffectiveness());

        return entity;
    }

    public ExerciseSymptomDto toDto(ExerciseSymptomEntity entity) {
        ExerciseSymptomDto dto = new ExerciseSymptomDto();

        dto.setId(entity.getId());

        ExerciseDto exerciseDto = exerciseMapper.toDto(entity.getExercise());
        dto.setExercise(exerciseDto);

        SymptomDto symptomDto = symptomMapper.toDto(entity.getSymptom());
        dto.setSymptom(symptomDto);
        
        dto.setEffectiveness(entity.getEffectiveness());

        return dto;
    }
}
