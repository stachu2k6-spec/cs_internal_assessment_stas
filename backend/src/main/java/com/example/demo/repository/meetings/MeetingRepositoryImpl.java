package com.example.demo.repository.meetings;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.UUID;

public class MeetingRepositoryImpl implements MeetingRepositoryCustom{

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<MeetingEntity> getPatientMeetingsById(UUID patientId) {

        String query ="SELECT meetingEntity FROM MeetingEntity meetingEntity " +
                "LEFT JOIN FETCH meetingEntity.patient patient " +
                "WHERE patient.id = (:patientId)";


        return entityManager.createQuery(query, MeetingEntity.class)
                .setParameter("patientId", patientId)
                .getResultList();

    }

    public List<MeetingEntity> getMonthMeetings(int year, int month) {

        String query =
                "SELECT meetingEntity FROM MeetingEntity meetingEntity " +
                        "LEFT JOIN FETCH meetingEntity.patient patient " +
                        "WHERE EXTRACT(MONTH FROM meetingEntity.dateTime) = :month " +
                        "AND EXTRACT(YEAR FROM meetingEntity.dateTime) = :year";

        return entityManager.createQuery(query, MeetingEntity.class)
                .setParameter("month", month)
                .setParameter("year", year)
                .getResultList();
    }

}
