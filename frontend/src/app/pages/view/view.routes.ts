import { Patient } from '@/pages/view/patient/patient';
import { Routes } from '@angular/router'
import { Meeting } from '@/pages/view/meeting/meeting';
import { Symptom } from '@/pages/view/symptom/symptom';
import { Exercise } from '@/pages/view/exercise/exercise';

export default [
    { path: 'patient/:id', data: { breadcrumb: 'Patient' }, component: Patient },
    { path: 'patient/newPatient', data: { breadcrumb: 'Patient' }, component: Patient },
    { path: 'meeting/:id', data: { breadcrumb: 'Meeting' }, component: Meeting },
    { path: 'meeting/newMeeting', data: { breadcrumb: 'Meeting' }, component: Meeting },
    { path: 'symptom/:id', data: { breadcrumb: 'Symptom' }, component: Symptom },
    { path: 'symptom/newSymptom', data: { breadcrumb: 'Symptom' }, component: Symptom },
    { path: 'exercise/:id', data: { breadcrumb: 'Exercise' }, component: Exercise },
    { path: 'exercise/newExercise', data: { breadcrumb: 'Exercise' }, component: Exercise },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
