package com.example.demo.controllers.symptoms;

import com.example.demo.domains.symptoms.SymptomsFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/symptoms")
public class SymptomsController {

    private final SymptomsFacade symptomFacade;

    public SymptomsController(SymptomsFacade symptomFacade) {
        this.symptomFacade = symptomFacade;
    }

    @GetMapping
    public List<SymptomsDto> getSymptoms() {
        return symptomFacade.getSymptoms();
    }

    @PostMapping
    public SymptomsDto addSymptom(@RequestBody SymptomsDto symptomsDto) {
        return symptomFacade.addSymptoms(symptomsDto);
    }

    @GetMapping("/{id}")
    public SymptomsDto getSymptom(@PathVariable String id) {
        return symptomFacade.getSymptomsById(id);
    }

    @PutMapping("/{id}")
    public SymptomsDto updateSymptom(@PathVariable String id, @RequestBody SymptomsDto symptomsDto) {
        return symptomFacade.updateSymptom(id, symptomsDto);
    }

    @DeleteMapping("/{id}")
    public String deleteSymptom(@PathVariable String id) {
        symptomFacade.deleteSymptom(id);
        return "ok";
    }
}
