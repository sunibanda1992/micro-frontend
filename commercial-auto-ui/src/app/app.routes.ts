import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'client',
    pathMatch: 'full'
  },
  {
    path: 'client',
    loadComponent: () => import('./client/client').then(m => m.Client)
  },
  {
    path: 'driver',
    loadComponent: () => import('./driver/driver').then(m => m.Driver)
  },
  {
    path: 'vehicle',
    loadComponent: () => import('./vehicle/vehicle').then(m => m.Vehicle)
  }
];
