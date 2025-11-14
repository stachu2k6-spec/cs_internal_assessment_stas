import { ButtonDemo } from '@/pages/uikit/buttondemo';
import { ChartDemo } from '@/pages/uikit/chartdemo';
import { FileDemo } from '@/pages/uikit/filedemo';
import { FormLayoutDemo } from '@/pages/uikit/formlayoutdemo';
import { InputDemo } from '@/pages/uikit/inputdemo';
import { ListDemo } from '@/pages/uikit/listdemo';
import { MediaDemo } from '@/pages/uikit/mediademo';
import { MessagesDemo } from '@/pages/uikit/messagesdemo';
import { MiscDemo } from '@/pages/uikit/miscdemo';
import { PanelsDemo } from '@/pages/uikit/panelsdemo';
import { TimelineDemo } from '@/pages/uikit/timelinedemo';
import { TableDemo } from '@/pages/uikit/tabledemo';
import { OverlayDemo } from '@/pages/uikit/overlaydemo';
import { TreeDemo } from '@/pages/uikit/treedemo';
import { MenuDemo } from '@/pages/uikit/menudemo';
import { Patients } from '@/pages/menu/patients/patients';
import { Meetings } from '@/pages/menu/meetings/meetings';
import { Symptoms } from '@/pages/menu/symptoms/symptoms';
import { Exercises } from '@/pages/menu/exercises/exercises';
import { Statistics } from '@/pages/menu/statistics/statistics';
import { Routes } from '@angular/router';

export default [
    { path: 'patients', data: { breadcrumb: 'Patients' }, component: Patients },
    { path: 'meetings', data: { breadcrumb: 'Meetings' }, component: Meetings },
    { path: 'symptoms', data: { breadcrumb: 'Symptoms' }, component: Symptoms },
    { path: 'exercises', data: { breadcrumb: 'Exercises' }, component: Exercises },
    { path: 'statistics', data: { breadcrumb: 'Statistics' }, component: Statistics },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
