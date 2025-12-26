import { PatientDto } from '../patient/patient.model';
import { ExerciseDto } from '../exercise/exercise.model';

export interface MeetingDto {
    id: string;
    patient: PatientDto; // Associated patient
    dateTime: Date;
    duration: number;
    notes: string;
    rating: number; // 1 to 5
    exercises: ExerciseDto[];
}

export interface CreateMeetingDto {
    patientId: string;      // Associated patient ID
    dateTime: Date;
    duration: number;
    notes: string;
    rating: number;         // 1 to 5
}
