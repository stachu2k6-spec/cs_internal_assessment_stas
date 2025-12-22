import { PatientDto } from '@/pages/service/patient/patient.model';

export interface MeetingDto {
    id: string;
    patient: PatientDto; // Associated patient
    dateTime: Date; // ISO date: '2025-11-24'
    duration: number; // ISO-8601 duration: 'PT60M' or number of minutes
    notes: string;
    rating: number; // 1 to 5
}

export interface CreateMeetingDto {
    patientId: string;      // Associated patient ID
    dateTime: Date;
    duration: number;        // ISO-8601 duration: 'PT60M' (1 hour)
    notes: string;
    rating: number;         // 1 to 5
}
