package com.example.demo.repository.meetings;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.UUID;

import com.example.demo.repository.meetings.MeetingEntity;
import com.example.demo.repository.meetings.MeetingRepositoryImpl;
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
    void getPatientMeetingsById_returnsMeetingsForPatient() {
        // given
        List<MeetingEntity> expectedMeetings = List.of(
                new MeetingEntity(),
                new MeetingEntity()
        );

        when(entityManager.createQuery(anyString(), eq(MeetingEntity.class)))
                .thenReturn(typedQuery);
        when(typedQuery.setParameter(eq("patientId"), eq(patientId)))
                .thenReturn(typedQuery);
        when(typedQuery.getResultList())
                .thenReturn(expectedMeetings);

        // when
        List<MeetingEntity> result = repository.getPatientMeetingsById(patientId);

        // then
        assertEquals(expectedMeetings, result);

        verify(entityManager).createQuery(
                contains("FROM MeetingEntity"),
                eq(MeetingEntity.class)
        );
        verify(typedQuery).setParameter("patientId", patientId);
        verify(typedQuery).getResultList();
    }
}
