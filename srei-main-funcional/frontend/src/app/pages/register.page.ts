import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TopbarComponent } from './topbar.component';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TopbarComponent],
  template: `
  <app-topbar />
  <div class="container">
    <div class="card" style="max-width:620px; margin: 18px auto;">
      <h2 style="margin:0 0 10px 0;">Registro de asistente</h2>
      <p style="margin:0 0 16px 0; color:#6b7280;">Crea tu cuenta para comentar, asistir por QR y responder trivia.</p>

      <div class="row">
        <div>
          <label>Nombres</label>
          <input class="input" [(ngModel)]="nombres" />
        </div>
        <div>
          <label>Apellidos</label>
          <input class="input" [(ngModel)]="apellidos" />
        </div>
      </div>

      <div class="row" style="margin-top:12px;">
        <div>
          <label>Correo</label>
          <input class="input" [(ngModel)]="correo" placeholder="correo@email.com" />
        </div>
        <div>
          <label>Contraseña</label>
          <input class="input" type="password" [(ngModel)]="contrasena" />
        </div>
      </div>

      <div style="margin-top:14px; display:flex; gap:10px;">
        <button class="btn btn-primary" (click)="registrar()">
          <span class="material-icons">check</span>
          Registrarme
        </button>
        <a class="btn" routerLink="/login">
          <span class="material-icons">arrow_back</span>
          Volver
        </a>
      </div>

      <p *ngIf="error" style="margin-top:12px; color:#b91c1c;">{{error}}</p>
    </div>
  </div>
  `
})
export class RegisterPage {
  nombres = '';
  apellidos = '';
  correo = '';
  contrasena = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.error = '';
    this.auth.register({ nombres: this.nombres, apellidos: this.apellidos, correo: this.correo, contrasena: this.contrasena }).subscribe({
      next: (resp) => {
        this.auth.saveSession(resp);
        this.router.navigateByUrl('/eventos');
      },
      error: (e) => {
        this.error = e?.error?.message || 'No se pudo registrar';
      }
    });
  }
}
