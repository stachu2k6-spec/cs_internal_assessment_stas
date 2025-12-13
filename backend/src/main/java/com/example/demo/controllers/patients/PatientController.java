package com.example.demo.controllers.patients;

import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.domains.patients.PatientFacade;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientFacade patientFacade;

    public PatientController(PatientFacade patientFacade) {
        this.patientFacade = patientFacade;
    }

    @GetMapping
    public List<PatientDto> getPatients() {
        return patientFacade.getPatients();
    }

    @PostMapping
    public PatientDto addPatient(@RequestBody PatientDto patientDto) {
        return patientFacade.addPatients(patientDto);
    }

    @GetMapping("/{id}")
    public PatientDto getPatient(@PathVariable String id) {
        return patientFacade.getPatientById(id);
    }

    @PutMapping("/{id}")
    public PatientDto updatePatient(@PathVariable String id, @RequestBody PatientDto patientDto) {
        return patientFacade.updatePatient(id, patientDto);
    }

    @DeleteMapping("/{id}")
    public PatientDto deletePatient(@PathVariable String id) {
        return patientFacade.deletePatient(id);
    }
}
