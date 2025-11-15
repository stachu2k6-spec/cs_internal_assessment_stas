package com.example.demo.controllers.patients;

import com.example.demo.domains.patients.PatientsFacade;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientsController {

    private final PatientsFacade patientFacade;

    public PatientsController(PatientsFacade patientFacade) {
        this.patientFacade = patientFacade;
    }

    @GetMapping
    public List<PatientsDto> getPatients() {
        return patientFacade.getPatients();
    }

    @PostMapping
    public PatientsDto addPatient(@RequestBody PatientsDto patientsDto) {
        return patientFacade.addPatients(patientsDto);
    }

    @GetMapping("/{id}")
    public PatientsDto getPatient(@PathVariable String id) {
        return patientFacade.getPatientsById(id);
    }

    @PutMapping("/{id}")
    public PatientsDto updatePatient(@PathVariable String id, @RequestBody PatientsDto patientsDto) {
        return patientFacade.updatePatient(id, patientsDto);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable String id) {
        patientFacade.deletePatient(id);
        return "ok";
    }
}
