package com.example.demo.controllers.patientSymptom;

import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.controllers.patientSymptom.PatientSymptomDto;
import com.example.demo.domains.patientSymptom.PatientSymptomFacade;
import com.example.demo.domains.patientSymptom.PatientSymptomFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient-symptoms")
public class PatientSymptomController {

    private final PatientSymptomFacade patientSymptomFacade;

    public PatientSymptomController(PatientSymptomFacade patientSymptomFacade) {
        this.patientSymptomFacade = patientSymptomFacade;
    }

    @GetMapping
    public List<PatientSymptomDto> getPatientSymptoms() {
        return patientSymptomFacade.getPatientSymptoms();
    }

    @GetMapping("/{id}")
    public PatientSymptomDto getPatientSymptom(@PathVariable String id) {
        return patientSymptomFacade.getPatientSymptomById(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<PatientSymptomDto> getPatientSymptomsByPatientId(@PathVariable String patientId) {
        return patientSymptomFacade.getPatientSymptomsByPatientId(patientId);
    }

    @PostMapping()
    public PatientSymptomDto addPatientSymptom(@RequestBody PatientSymptomDto patientSymptomDto) {
        return patientSymptomFacade.addPatientSymptom(patientSymptomDto);
    }

    @PutMapping("/{id}")
    public PatientSymptomDto updatePatientSymptom(@PathVariable String id, @RequestBody PatientSymptomDto patientSymptomDto) {
        return patientSymptomFacade.updatePatientSymptom(id, patientSymptomDto);
    }

    @DeleteMapping("/{id}")
    public String deletePatientSymptom(@PathVariable String id) {
        patientSymptomFacade.deletePatientSymptom(id);
        return "ok";
    }
}
