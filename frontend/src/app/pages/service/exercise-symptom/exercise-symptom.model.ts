import { PatientDto } from '@/pages/service/patient/patient.model';
import { SymptomDto } from '@/pages/service/symptom/symptom.model';
import { ExerciseDto } from '@/pages/service/exercise/exercise.model';

export interface ExerciseSymptomDto {
    id: string;
    exercise: ExerciseDto;
    symptom: SymptomDto;
    effectiveness: number
}
