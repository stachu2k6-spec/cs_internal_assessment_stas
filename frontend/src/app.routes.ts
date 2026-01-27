import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Notfound } from './app/pages/notfound/notfound';
import { HomePage } from '@/pages/home-page/home-page';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: HomePage },
            { path: 'menu', loadChildren: () => import('./app/pages/menu/menu.routes') },
            { path: 'view', loadChildren: () => import('@/pages/view/view.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },

    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
