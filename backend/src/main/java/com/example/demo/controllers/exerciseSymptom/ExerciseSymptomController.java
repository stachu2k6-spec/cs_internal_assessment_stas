package com.example.demo.controllers.exerciseSymptom;

import com.example.demo.controllers.exerciseSymptom.ExerciseSymptomDto;
import com.example.demo.domains.exerciseSymptom.ExerciseSymptomFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercise-symptoms")
public class ExerciseSymptomController {

    private final ExerciseSymptomFacade exerciseSymptomFacade;

    public ExerciseSymptomController(ExerciseSymptomFacade exerciseSymptomFacade) {
        this.exerciseSymptomFacade = exerciseSymptomFacade;
    }

    @GetMapping
    public List<ExerciseSymptomDto> getExerciseSymptoms() {
        return exerciseSymptomFacade.getExerciseSymptoms();
    }

    @GetMapping("/{id}")
    public ExerciseSymptomDto getExerciseSymptom(@PathVariable String id) {
        return exerciseSymptomFacade.getExerciseSymptomById(id);
    }

    @GetMapping("/exercise/{exerciseId}")
    public List<ExerciseSymptomDto> getExerciseSymptomsByExerciseId(@PathVariable String exerciseId) {
        return exerciseSymptomFacade.getExerciseSymptomsByExerciseId(exerciseId);
    }

    @GetMapping("/symptom/{symptomId}")
    public List<ExerciseSymptomDto> getExerciseSymptomsBySymptomId(@PathVariable String symptomId) {
        return exerciseSymptomFacade.getExerciseSymptomsBySymptomId(symptomId);
    }

    @PostMapping("/symptom/list")
    public List<ExerciseSymptomDto> getExerciseSymptomsBySymptomIds(@RequestBody List<String> symptomIds) {
        return exerciseSymptomFacade.getExerciseSymptomsBySymptomIds(symptomIds);
    }

    @PostMapping()
    public ExerciseSymptomDto addExerciseSymptom(@RequestBody ExerciseSymptomDto exerciseSymptomDto) {
        return exerciseSymptomFacade.addExerciseSymptom(exerciseSymptomDto);
    }

    @PutMapping("/{id}")
    public ExerciseSymptomDto updateExerciseSymptom(@PathVariable String id, @RequestBody ExerciseSymptomDto exerciseSymptomDto) {
        return exerciseSymptomFacade.updateExerciseSymptom(id, exerciseSymptomDto);
    }

    @PutMapping("/many")
    public ExerciseSymptomDto[] updateExerciseSymptoms(@RequestBody ExerciseSymptomDto[] exerciseSymptoms) {
        return exerciseSymptomFacade.updateExerciseSymptoms(exerciseSymptoms);
    }

    @DeleteMapping("/{id}")
    public void deleteExerciseSymptom(@PathVariable String id) {
        exerciseSymptomFacade.deleteExerciseSymptom(id);
    }
}
