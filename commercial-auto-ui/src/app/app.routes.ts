import { Routes } from '@angular/router';
import { registrationFormResolver } from './guards/registration-form.resolver';

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
  },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration').then(m => m.Registration),
    resolve: {
      formConfig: registrationFormResolver
    }
  }
];
