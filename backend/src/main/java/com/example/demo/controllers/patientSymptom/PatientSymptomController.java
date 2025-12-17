package com.example.demo.controllers.patientSymptom;

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

    /* ===================== GET ===================== */

    @GetMapping
    public List<PatientSymptomDto> getAll() {
        return patientSymptomFacade.getAll();
    }

    @GetMapping("/{patientId}/{symptomId}")
    public PatientSymptomDto getByKey(
            @PathVariable String patientId,
            @PathVariable String symptomId
    ) {
        return patientSymptomFacade.getByKey(patientId, symptomId);
    }

    /* ===================== CREATE ===================== */

    @PostMapping
    public PatientSymptomDto create(
            @RequestBody PatientSymptomDto dto
    ) {
        return patientSymptomFacade.create(dto);
    }

    /* ===================== UPDATE ===================== */

    @PutMapping("/{patientId}/{symptomId}")
    public PatientSymptomDto update(
            @PathVariable String patientId,
            @PathVariable String symptomId,
            @RequestBody PatientSymptomDto dto
    ) {
        return patientSymptomFacade.update(patientId, symptomId, dto);
    }

    /* ===================== DELETE ===================== */

    @DeleteMapping("/{patientId}/{symptomId}")
    public void delete(
            @PathVariable String patientId,
            @PathVariable String symptomId
    ) {
        patientSymptomFacade.delete(patientId, symptomId);
    }
}
