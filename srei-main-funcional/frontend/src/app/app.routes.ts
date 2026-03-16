import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { EventosPage } from './pages/eventos.page';
import { EventoDetallePage } from './pages/evento-detalle.page';
import { DashboardShell } from './pages/dashboard.shell';
import { DashboardHome } from './pages/dashboard.home';
import { AdminUsuariosPage } from './pages/admin-usuarios.page';
import { DocenteProponerPage } from './pages/docente-proponer.page';
import { DocenteRechazadosPage } from './pages/docente-rechazados.page';
import { PendientesPage } from './pages/pendientes.page';
import { ReportesPage } from './pages/reportes.page';

export const routes: Routes = [
  //{ path: '', pathMatch: 'full', redirectTo: 'eventos' },

  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },

  {
    path: 'dashboard',
    component: DashboardShell,
    canActivate: [authGuard],
    children: [
      {
        path: 'usuarios',
        component: AdminUsuariosPage,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'proponer',
        component: DocenteProponerPage,
        canActivate: [roleGuard],
        data: { roles: ['DOCENTE'] },
      },
      {
        path: 'rechazados',
        component: DocenteRechazadosPage,
        canActivate: [roleGuard],
        data: { roles: ['DOCENTE'] },
      },
      {
        path: 'pendientes/decano',
        component: PendientesPage,
        canActivate: [roleGuard],
        data: { roles: ['DECANO'] },
      },
      {
        path: 'pendientes/coordinador',
        component: PendientesPage,
        canActivate: [roleGuard],
        data: { roles: ['COORDINADOR'] },
      },
      {
        path: 'reportes',
        component: ReportesPage,
        canActivate: [roleGuard],
        data: { roles: ['DECANO', 'COORDINADOR', 'ADMIN', 'DOCENTE','ASISTENTE'] },
      },

      { path: 'eventos', component: EventosPage },

      { path: 'eventos/:id', component: EventoDetallePage },
      { path: '', component: DashboardHome },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  //{ path: '**', redirectTo: 'eventos' }
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
