package com.example.demo.controllers.exercises;

import com.example.demo.domains.meetings.MeetingsFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
public class ExercisesController {

    private final MeetingsFacade exerciseFacade;

    public ExercisesController(MeetingsFacade exerciseFacade) {
        this.exerciseFacade = exerciseFacade;
    }

    @GetMapping
    public List<ExercisesDto> getExercises() {
        return exerciseFacade.getExercises();
    }

    @PostMapping
    public ExercisesDto addExercise(@RequestBody ExercisesDto exercisesDto) {
        return exerciseFacade.addExercises(exercisesDto);
    }

    @GetMapping("/{id}")
    public ExercisesDto getExercise(@PathVariable String id) {
        return exerciseFacade.getExercisesById(id);
    }

    @PutMapping("/{id}")
    public ExercisesDto updateExercise(@PathVariable String id, @RequestBody ExercisesDto exercisesDto) {
        return exerciseFacade.updateExercise(id, exercisesDto);
    }

    @DeleteMapping("/{id}")
    public String deleteExercise(@PathVariable String id) {
        exerciseFacade.deleteExercise(id);
        return "ok";
    }
}
