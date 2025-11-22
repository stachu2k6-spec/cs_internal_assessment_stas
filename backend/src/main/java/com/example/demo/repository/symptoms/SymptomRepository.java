package com.example.demo.repository.symptoms;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SymptomRepository extends JpaRepository<SymptomEntity, UUID> {
}
