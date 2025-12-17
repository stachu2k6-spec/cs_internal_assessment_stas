import { PatientDto } from '@/pages/service/patient/patient.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';

export interface PatientSymptomDto {
    patientId: string;
    symptomId: string;
    severity: number;
}

export interface PatientSymptomObjectDto {
    patient: PatientDto;
    symptom: SymptomDto;
    severity: number
}
