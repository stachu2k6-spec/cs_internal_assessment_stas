package com.example.demo.repository.meetings;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MeetingRepositoryImplTest {

    @Mock
    private EntityManager entityManager;

    @Mock
    private TypedQuery<MeetingEntity> typedQuery;

    @InjectMocks
    private MeetingRepositoryImpl repository;

    private UUID patientId;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
    }

    @Test
    void getPatientMeetingsById_returnsMeetings() {
        // given
        List<MeetingEntity> expected = List.of(
                new MeetingEntity(),
                new MeetingEntity()
        );

        when(entityManager.createQuery(anyString(), eq(MeetingEntity.class)))
                .thenReturn(typedQuery);
        when(typedQuery.setParameter("patientId", patientId))
                .thenReturn(typedQuery);
        when(typedQuery.getResultList())
                .thenReturn(expected);

        // when
        List<MeetingEntity> result = repository.getPatientMeetingsById(patientId);

        // then
        assertEquals(expected, result);
        verify(entityManager).createQuery(
                contains("LEFT JOIN FETCH meetingEntity.patient"),
                eq(MeetingEntity.class)
        );
        verify(typedQuery).setParameter("patientId", patientId);
        verify(typedQuery).getResultList();
    }

    @Test
    void getMonthMeetings_returnsMeetingsForMonthAndYear() {
        // given
        int month = 5;
        int year = 2025;

        List<MeetingEntity> expected = List.of(
                new MeetingEntity()
        );

        when(entityManager.createQuery(anyString(), eq(MeetingEntity.class)))
                .thenReturn(typedQuery);
        when(typedQuery.setParameter("month", month))
                .thenReturn(typedQuery);
        when(typedQuery.setParameter("year", year))
                .thenReturn(typedQuery);
        when(typedQuery.getResultList())
                .thenReturn(expected);

        // when
        List<MeetingEntity> result = repository.getMonthMeetings(year, month);

        // then
        assertEquals(expected, result);
        verify(entityManager).createQuery(
                contains("FUNCTION('MONTH'"),
                eq(MeetingEntity.class)
        );
        verify(typedQuery).setParameter("month", month);
        verify(typedQuery).setParameter("year", year);
        verify(typedQuery).getResultList();
    }
}
