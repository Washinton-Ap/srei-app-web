import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="topbar">
      <div class="inner">
        <a class="brand" [routerLink]="loggedIn ? ['/dashboard'] : ['/login']">
          <img
            src="/uteq.png"
            alt="UTEQ"
            style="height:40px; width:auto; background:white; border-radius:8px; padding:2px;"
          />
          <div style="display:grid; line-height:1.1;">
            <span style="font-size:20px;font-weight:1000; letter-spacing:0.2px;"> Sistema de registro de eventos</span>
            <span style="font-size:18px; opacity:0.9;">Interculturales (SREI)</span>
          </div>
        </a>

        <div style="display:flex; gap:10px; align-items:center;">
          <!--<a class="btn" routerLink="/eventos"><span class="material-icons">public</span>Eventos</a> -->
          <ng-container *ngIf="loggedIn">
            <!--<a class="btn btn-primary" routerLink="/login"><span class="material-icons">login</span>Ingresar</a>-->
            <span class="usuario-info"> {{ usuarioNombre }} - {{ usuarioRol }} </span>

            <a class="btn" routerLink="/dashboard"
              ><span class="material-icons">dashboard</span>Panel</a
            >
            <button class="btn" (click)="salir()">
              <span class="material-icons">logout</span>Salir
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `,

})
export class TopbarComponent {
  usuarioNombre = '';
  usuarioRol = '';

  ngOnInit() {
    const user = this.auth.getUsuario();
    const roles = this.auth.getRoles();

    if (user) {
      this.usuarioNombre = user.nombres + ' ' + user.apellidos;
    }

    if (roles.length) {
      this.usuarioRol = roles[0]; // primer rol
    }
  }
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  get loggedIn() {
    return this.auth.isLoggedIn();
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
