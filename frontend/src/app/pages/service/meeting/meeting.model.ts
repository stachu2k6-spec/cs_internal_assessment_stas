import { PatientDto } from '@/pages/service/patient/patient.model';

export interface MeetingDto {
    id: string;
    patient: PatientDto; // Associated patient
    date: Date; // ISO date: '2025-11-24'
    startTime: string | Date; // ISO time: '14:30:00'
    duration: string | number; // ISO-8601 duration: 'PT60M' or number of minutes
    notes: string;
}

export interface CreateMeetingDto {
    patientId: string;      // Associated patient ID
    date: Date;            // ISO date: '2025-11-24'
    startTime: string;       // ISO time: '14:30:00'
    duration: string;        // ISO-8601 duration: 'PT60M' (1 hour)
    notes: string;
}
