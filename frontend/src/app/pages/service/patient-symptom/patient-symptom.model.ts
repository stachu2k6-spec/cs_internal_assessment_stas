import { PatientDto } from '@/pages/service/patient/patient.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';

export interface PatientSymptomDto {
    id: string;
    patient: PatientDto;
    symptom: SymptomDto;
    severity: number
}
