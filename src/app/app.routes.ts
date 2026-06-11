import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
    },
    {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro').then(m => m.Cadastro)
    }
];
