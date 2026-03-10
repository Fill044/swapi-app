import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'people', pathMatch: 'full' },
    { path: 'people', loadComponent: () => import('./features/people-list/people-list').then(m => m.PeopleList) }
];
