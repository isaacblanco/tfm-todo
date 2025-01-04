import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard], // Protección de la ruta raíz
    children: [
      {
        path: '',
        redirectTo: 'todo/focus',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./auth/sign-up/sign-up.page').then((m) => m.SignUpPage),
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
    path: 'account',
    loadComponent: () =>
      import('./config/account/account.page').then((m) => m.AccountPage), // Página de configuración
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
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/project',
    loadComponent: () =>
      import('./todo/project/project.page').then((m) => m.ProjectPage), // Página de proyectos
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/project-kanban/:id',
    loadComponent: () =>
      import('./todo/project-kanban/project-kanban.page').then((m) => m.ProjectKanbanPage),
    canActivate: [AuthGuard],
  },
  {
    path: 'todo/project-timeline/:id',
    loadComponent: () =>
      import('./todo/project-timeline/project-timeline.page').then((m) => m.ProjectTimelinePage),
    canActivate: [AuthGuard],
  },
  
];
