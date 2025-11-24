package com.example.demo.controllers.symptoms;

import com.example.demo.domains.symptoms.SymptomsFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/symptoms")
public class SymptomController {

    private final SymptomsFacade symptomFacade;

    public SymptomController(SymptomsFacade symptomFacade) {
        this.symptomFacade = symptomFacade;
    }

    @GetMapping
    public List<SymptomDto> getSymptoms() {
        return symptomFacade.getSymptoms();
    }

    @PostMapping
    public SymptomDto addSymptom(@RequestBody SymptomDto symptomsDto) {
        return symptomFacade.addSymptoms(symptomsDto);
    }

    @GetMapping("/{id}")
    public SymptomDto getSymptom(@PathVariable String id) {
        return symptomFacade.getSymptomsById(id);
    }

    @PutMapping("/{id}")
    public SymptomDto updateSymptom(@PathVariable String id, @RequestBody SymptomDto symptomsDto) {
        return symptomFacade.updateSymptom(id, symptomsDto);
    }

    @DeleteMapping("/{id}")
    public String deleteSymptom(@PathVariable String id) {
        symptomFacade.deleteSymptom(id);
        return "ok";
    }
}
