package com.example.demo.repository.meetings;

import com.example.demo.repository.patients.PatientEntity;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class MeetingRepositoryImplTest {

    @Autowired
    private MeetingRepositoryImpl meetingRepository;

    @Autowired
    private EntityManager em;

    @Test
    void getPatientMeetingsById_shouldReturnMeetingsForPatient() {
        // GIVEN
        PatientEntity patient = new PatientEntity();
        em.persist(patient);

        MeetingEntity meeting1 = new MeetingEntity();
        meeting1.setPatient(patient);
        em.persist(meeting1);

        MeetingEntity meeting2 = new MeetingEntity();
        meeting2.setPatient(patient);
        em.persist(meeting2);

        em.flush();
        em.clear();

        // WHEN
        List<MeetingEntity> result =
                meetingRepository.getPatientMeetingsById(patient.getId());

        // THEN
        assertThat(result).hasSize(2);
        assertThat(result)
                .allMatch(m -> m.getPatient().getId().equals(patient.getId()));
    }
}
