import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'todo/focus',
    pathMatch: 'full', // Ruta por defecto
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.page').then((m) => m.LoginPage), // Página de login
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./config/settings/settings.page').then((m) => m.SettingsPage), // Página de configuración
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/focus',
    loadComponent: () =>
      import('./todo/focus/focus.page').then((m) => m.FocusPage), // Página de "Focus"
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/project/:id', // Define el parámetro dinámico :id
    loadComponent: () =>
      import('./todo/project/project.page').then((m) => m.ProjectPage),
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/project',
    loadComponent: () =>
      import('./todo/project/project.page').then((m) => m.ProjectPage), // Página de proyectos
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'todo/focus', // Ruta comodín
  },
];
