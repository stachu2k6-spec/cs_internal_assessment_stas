import { PatientView } from '@/pages/object-view/patient-view/patient-view';
import { Routes } from '@angular/router'
import { MeetingView } from '@/pages/object-view/meeting-view/meeting-view';
import { SymptomView } from '@/pages/object-view/symptom-view/symptom-view';
import { ExerciseView } from '@/pages/object-view/exercise-view/exercise-view';

export default [
    { path: 'patient-view', data: { breadcrumb: 'PatientView' }, component: PatientView },
    { path: 'meeting-view', data: { breadcrumb: 'MeetingView' }, component: MeetingView },
    { path: 'symptom-view', data: { breadcrumb: 'SymptomView' }, component: SymptomView },
    { path: 'exercise-view', data: { breadcrumb: 'ExerciseView' }, component: ExerciseView },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
