import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TopbarComponent } from './topbar.component';
import { OnInit } from '@angular/core';

@Component({
  
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TopbarComponent],
  template: `
  <app-topbar />
  <div class="container">
    <div class="card" style="max-width:520px; margin: 18px auto;">
      <h2 style="margin:0 0 10px 0;">Iniciar sesión</h2>
      <p style="margin:0 0 16px 0; color:#6b7280;">Usa tus credenciales para acceder al sistema.</p>

      <div class="row">
        <div>
          <label>Correo</label>
          <input class="input" [(ngModel)]="correo" placeholder="correo@uteq.edu.ec" />
        </div>
        <div>
          <label>Contraseña</label>
          <input class="input" type="password" [(ngModel)]="contrasena" placeholder="********" />
        </div>
      </div>

      <div style="margin-top:14px; display:flex; gap:10px;">
        <button class="btn btn-primary" (click)="ingresar()">
          <span class="material-icons">login</span>
          Ingresar
        </button>
        <a class="btn" routerLink="/register">
          <span class="material-icons">person_add</span>
          Registrarme
        </a>
      </div>

      <p *ngIf="error" style="margin-top:12px; color:#b91c1c;">{{error}}</p>

      
    </div>
  </div>
  `
  
})
export class LoginPage implements OnInit {
  
  correo = '';
  contrasena = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {

   
    }
  ngOnInit() {
  if (this.auth.isLoggedIn()) {
    this.router.navigateByUrl('/dashboard');
  }
}

  ingresar() {
    this.error = '';
    this.auth.login({ correo: this.correo, contrasena: this.contrasena }).subscribe({
      next: (resp) => {
        this.auth.saveSession(resp);
        this.router.navigateByUrl('/dashboard');
      },
      error: (e) => {
        this.error = e?.error?.message || 'No se pudo iniciar sesión';
      }
    });
  }
}
function ngOnInit() {
  throw new Error('Function not implemented.');
}

