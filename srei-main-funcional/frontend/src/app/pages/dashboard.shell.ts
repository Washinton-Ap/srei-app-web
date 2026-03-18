import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TopbarComponent } from './topbar.component';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, TopbarComponent],
  template: `
    <app-topbar />

    <div class="container">
      <div class="layout">
        <div class="sidebar">
          <div class="card">
            <div style="font-weight:700; display:flex; align-items:center; gap:10px;">
              <span class="material-icons" style="color: var(--uteq-verde)">shield</span>
              Panel
            </div>
            <div style="margin-top:10px; display:grid; gap:10px;">
              <a
                class="nav-item"
                routerLink="/dashboard"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                <span class="material-icons">home</span>
                Inicio
              </a>

              <a
                *ngIf="roles.includes('ADMIN')"
                class="nav-item"
                routerLink="/dashboard/usuarios"
                routerLinkActive="active"
              >
                <span class="material-icons">group</span>
                Usuarios
              </a>

              <a
                *ngIf="roles.includes('DOCENTE')"
                class="nav-item"
                routerLink="/dashboard/proponer"
                routerLinkActive="active"
              >
                <span class="material-icons">add_box</span>
                Proponer evento
              </a>

              <a
                *ngIf="roles.includes('DOCENTE')"
                class="nav-item"
                routerLink="/dashboard/rechazados"
                routerLinkActive="active"
              >
                <span class="material-icons">assignment_late</span>
                Rechazados
              </a>

              <a
                *ngIf="roles.includes('DECANO')"
                class="nav-item"
                routerLink="/dashboard/pendientes/decano"
                routerLinkActive="active"
              >
                <span class="material-icons">fact_check</span>
                Pendientes (Decano)
              </a>

              <a
                *ngIf="roles.includes('COORDINADOR')"
                class="nav-item"
                routerLink="/dashboard/pendientes/coordinador"
                routerLinkActive="active"
              >
                <span class="material-icons">fact_check</span>
                Pendientes (Coordinación)
              </a>

              <a class="nav-item" routerLink="/dashboard/reportes" routerLinkActive="active">
                <span class="material-icons">analytics</span>
                Reportes
              </a>

              <a class="nav-item" routerLink="/dashboard/eventos" routerLinkActive="active">
                <span class="material-icons">public</span>
                Eventos
              </a>
            </div>
          </div>
        </div>
        <div>
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class DashboardShell {
  roles: string[] = [];
  constructor(private auth: AuthService) {
    this.roles = JSON.parse(localStorage.getItem('roles') || '[]');
  }
}
