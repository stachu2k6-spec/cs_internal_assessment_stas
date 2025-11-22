package com.example.demo.domains.patients;


import com.example.demo.controllers.patients.PatientsDto;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PatientsFacade {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientsFacade(PatientRepository patientRepository, PatientMapper patientMapper) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
    }

    public List<PatientsDto> getPatients() {
        List<PatientEntity> patientRepositoryAll = this.patientRepository.findAll();

        return patientRepositoryAll
                .stream()
                .map(patientMapper::toDto)
                .toList();
    }

    public PatientsDto addPatients(PatientsDto patientsDto) {
        PatientEntity patientEntity = this.patientMapper.toEntity(patientsDto);
        PatientEntity savedEntity = this.patientRepository.save(patientEntity);
        return patientMapper.toDto(savedEntity);
    }

    public PatientsDto getPatientsById(String id) {

        return patientRepository.findById(UUID.fromString(id))
                .map(patientMapper::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    public PatientsDto updatePatient(String id, PatientsDto patientsDto) {
        PatientEntity patient_not_found = patientRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        patient_not_found.setName(patientsDto.getName());
        patient_not_found.setSurname(patientsDto.getSurname());
        patient_not_found.setAddress(patientsDto.getAddress());
        patient_not_found.setNotes(patientsDto.getNotes());

        PatientEntity patientEntity = patientRepository.save(patient_not_found);

        return patientMapper.toDto(patientEntity);
    }

    public void deletePatient(String id) {
        this.patientRepository.deleteById(UUID.fromString(id));
    }
}
