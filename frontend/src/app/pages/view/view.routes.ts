import { Patient } from '@/pages/view/patient/patient';
import { Routes } from '@angular/router'
import { Meeting } from '@/pages/view/meeting/meeting';
import { Symptom } from '@/pages/view/symptom/symptom';
import { Exercise } from '@/pages/view/exercise/exercise';

export default [
    { path: 'patient', data: { breadcrumb: 'Patient' }, component: Patient },
    { path: 'meeting', data: { breadcrumb: 'Meeting' }, component: Meeting },
    { path: 'symptom', data: { breadcrumb: 'Symptom' }, component: Symptom },
    { path: 'exercise', data: { breadcrumb: 'Exercise' }, component: Exercise },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
