import { Patients } from '@/pages/menu/patients/patients';
import { Meetings } from '@/pages/menu/meetings/meetings';
import { Symptoms } from '@/pages/menu/symptoms/symptoms';
import { Exercises } from '@/pages/menu/exercises/exercises';
import { Routes } from '@angular/router';

export default [
    { path: 'patients', data: { breadcrumb: 'Patients' }, component: Patients },
    { path: 'meetings', data: { breadcrumb: 'Meetings' }, component: Meetings },
    { path: 'symptoms', data: { breadcrumb: 'Symptoms' }, component: Symptoms },
    { path: 'exercises', data: { breadcrumb: 'Exercises' }, component: Exercises },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
