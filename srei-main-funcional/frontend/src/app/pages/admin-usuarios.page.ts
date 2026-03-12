import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../core/services/usuario.service';
import { ListaRoles } from '../modules/roles/lista-roles/lista-roles';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 style="margin:0;">Usuarios</h2>
      <p style="margin-top:8px; color:#6b7280;">
        Crear usuarios, asignar roles y deshabilitar cuentas.
      </p>

      <div class="card" style="margin-top:12px;">
        <div class="row">
          <div><label>Nombres</label><input class="input" [(ngModel)]="nombres" /></div>
          <div><label>Apellidos</label><input class="input" [(ngModel)]="apellidos" /></div>
        </div>
        <div class="row" style="margin-top:12px;">
          <div><label>Correo</label><input class="input" [(ngModel)]="correo" /></div>
          <div>
            <label>Contraseña</label
            ><input class="input" type="password" [(ngModel)]="contrasena" />
          </div>
        </div>
        <div class="row" style="margin-top:12px;">
          <div>
            <label>Rol</label>
            <select class="input" [(ngModel)]="rol">
              <option *ngFor="let r of roles" [value]="r">
                {{ r }}
              </option>
            </select>
          </div>
          <div>
            <label>Facultad / Carrera (opcional)</label>
            <div class="row">
              <input class="input" [(ngModel)]="facultad" placeholder="Facultad" />
              <input class="input" [(ngModel)]="carrera" placeholder="Carrera" />
            </div>
          </div>
        </div>

        <button class="btn btn-primary" style="margin-top:12px;" (click)="crear()">
          <span class="material-icons">person_add</span>
          Crear
        </button>

        <p *ngIf="error" style="color:#b91c1c; margin-top:10px;">{{ error }}</p>
      </div>
      <!-- diseno tabla anterior-->
      <div class="card" style="margin-top:12px;">
        <div style="font-weight:700; margin-bottom:10px;">Listado</div>
        <div
          *ngFor="let u of usuarios; trackBy: trackById"
          style="border-bottom:1px solid var(--borde); padding:10px 0;"
        >
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
            <div>
              <div style="font-weight:600;">{{ u.nombres }} {{ u.apellidos }}</div>
              <div style="color:#6b7280; font-size:13px;">
                {{ u.correo }} · Roles: {{ u.roles.join(', ') }}
              </div>
            </div>
            <div style="display:flex; gap:8px;">
              <button class="btn" (click)="toggle(u)">
                <span class="material-icons">{{ u.habilitado ? 'toggle_on' : 'toggle_off' }}</span>
                {{ u.habilitado ? 'Habilitado' : 'Deshabilitado' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--jsjjdjd-->
      <!--
<div class="card" style="margin-top:12px;">
  <div style="font-weight:700; margin-bottom:12px;">Listado de usuarios</div>

  <div *ngFor="let u of usuarios; trackBy: trackById"
       style="border-bottom:1px solid var(--borde); padding:12px 0;">

    <div style="display:grid; grid-template-columns: 1fr 200px 180px 150px; gap:10px; align-items:center;">

      <-- Datos ->
      <div>
        <div style="font-weight:600;">{{u.nombres}} {{u.apellidos}}</div>
        <div style="color:#6b7280; font-size:13px;">
          {{u.correo}}
        </div>
      </div>

      <-- Rol ->
      <div>
        <select class="input" [(ngModel)]="u.rol">
          <option value="ASISTENTE">ASISTENTE</option>
          <option value="DOCENTE">DOCENTE</option>
          <option value="COORDINADOR">COORDINADOR</option>
          <option value="DECANO">DECANO</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <-- Estado ->
      <div>
        <button class="btn" (click)="toggle(u)">
          <span class="material-icons">
            {{u.habilitado ? 'toggle_on' : 'toggle_off'}}
          </span>
          {{u.habilitado ? 'Habilitado' : 'Deshabilitado'}}
        </button>
      </div>

      <-- Guardar ->
      <div>
        <button class="btn btn-primary" (click)="actualizarRol(u)">
          <span class="material-icons">save</span>
          Guardar
        </button>
      </div>

    </div>

  </div>
</div>
--></div>
  `,
})
export class AdminUsuariosPage implements OnInit {
  usuarios: any[] = [];
  nombres = '';
  apellidos = '';
  correo = '';
  contrasena = '';
  rol = 'ASISTENTE';
  facultad = '';
  carrera = '';
  error = '';

  roles= ['ASISTENTE', 'DOCENTE', 'COORDINADOR', 'DECANO', 'ADMIN'];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.usuarioService.listar().subscribe((d) => (this.usuarios = d as any[]));
    //this.usuarioService.listarRoles().subscribe((d) => (this.roles = d as any[]));
  }

  crear() {
    this.error = '';
    this.usuarioService
      .crear({
        nombres: this.nombres,
        apellidos: this.apellidos,
        correo: this.correo,
        contrasena: this.contrasena,
        rol: this.rol,
        facultad: this.facultad || null,
        carrera: this.carrera || null,
      })
      .subscribe({
        next: () => {
          this.nombres = this.apellidos = this.correo = this.contrasena = '';
          this.facultad = this.carrera = '';
          this.cargar();
        },
        error: (e) => (this.error = e?.error?.message || 'Error creando usuario'),
      });
  }

  toggle(u: any) {
    this.usuarioService.habilitar(u.id, !u.habilitado).subscribe({ next: () => this.cargar() });
  }
  //Esto hace que Angular renderice listas grandes mucho más rápido.
  trackById(index: number, item: any) {
    return item.id;
  }
  actualizarRol(u: any) {
    this.usuarioService.actualizarRol(u.id, u.rol).subscribe({
      next: () => this.cargar(),
      error: () => (this.error = 'Error actualizando rol'),
    });
  }
}
