package com.example.demo.controllers.exercises;

import com.example.demo.domains.exercises.ExerciseFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class ExerciseController {

    private final ExerciseFacade exerciseFacade;

    public ExerciseController(ExerciseFacade exerciseFacade) {
        this.exerciseFacade = exerciseFacade;
    }

    @GetMapping
    public List<ExerciseDto> getExercises() {
        return exerciseFacade.getExercises();
    }

    @PostMapping
    public ExerciseDto addExercise(@RequestBody ExerciseDto exerciseDto) {
        return exerciseFacade.addExercises(exerciseDto);
    }

    @GetMapping("/{id}")
    public ExerciseDto getExercise(@PathVariable String id) {
        return exerciseFacade.getExercisesById(id);
    }

    @PutMapping("/{id}")
    public ExerciseDto updateExercise(@PathVariable String id, @RequestBody ExerciseDto exerciseDto) {
        return exerciseFacade.updateExercise(id, exerciseDto);
    }

    @DeleteMapping("/{id}")
    public void deleteExercise(@PathVariable String id) {
        exerciseFacade.deleteExercise(id);
    }
}
