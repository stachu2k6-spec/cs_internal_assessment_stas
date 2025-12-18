package com.example.demo.domains.patients;

import com.example.demo.controllers.meetings.MeetingDto;
import com.example.demo.controllers.patients.PatientDto;
import com.example.demo.domains.meetings.MeetingMapper;
import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.meetings.MeetingRepository;
import com.example.demo.repository.patients.PatientEntity;
import com.example.demo.repository.patients.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PatientFacade {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;

    public PatientFacade(PatientRepository patientRepository, PatientMapper patientMapper) {
        this.patientRepository = patientRepository;
        this.patientMapper = patientMapper;
    }

    public List<PatientDto> getPatients() {
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toDto)
                .toList();
    }

    public PatientDto addPatients(PatientDto patientDto) {
        PatientEntity patientEntity = patientMapper.toEntity(patientDto);
        PatientEntity savedEntity = patientRepository.save(patientEntity);
        return patientMapper.toDto(savedEntity);
    }

    public PatientDto getPatientById(String id) {
        return patientRepository.findById(UUID.fromString(id))
                .map(patientMapper::toDto)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found")
                );
    }

    public PatientDto updatePatient(String id, PatientDto patientDto) {
        PatientEntity patient = patientRepository.findById(UUID.fromString(id))
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found")
                );

        // Update fields
        patient.setName(patientDto.getName());
        patient.setSurname(patientDto.getSurname());
        patient.setBirthDate(patientDto.getBirthDate());
        patient.setGender(patientDto.getGender());
        patient.setAddress(patientDto.getAddress());
        patient.setPhoneNumber(patientDto.getPhoneNumber());
        patient.setEmail(patientDto.getEmail());
        patient.setNotes(patientDto.getNotes());
        patient.setActivityLevel(patientDto.getActivityLevel());
        patient.setPhotoUrl(patientDto.getPhotoUrl());

        PatientEntity updated = patientRepository.save(patient);

        return patientMapper.toDto(updated);
    }

    public void deletePatient(String id) {
        UUID uuid = UUID.fromString(id);

        if (!patientRepository.existsById(uuid)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found");
        }

        patientRepository.deleteById(uuid);
    }
}
