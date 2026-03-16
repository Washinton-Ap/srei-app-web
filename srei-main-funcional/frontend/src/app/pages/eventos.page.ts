import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventoService, EventoDto } from '../core/services/evento.service';
import { TopbarComponent } from './topbar.component';
import { routes } from '../app.routes';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';// para forzarlo que funcione con un solo click

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], //TopbarComponent
  template: `
    <!-- <app-topbar />
  <div class="container">
    <div class="card">
      <div style="display:flex; justify-content:space-between; gap:12px; align-items:center;">
        <div>
          <h2 style="margin:0;">Eventos aprobados</h2>
          <p style="margin:6px 0 0 0; color:#6b7280;">Visualiza eventos, comenta, asiste con QR y responde trivia.</p>
        </div>
        <a class="btn" href="http://localhost:8080/api/eventos/plantilla-informe" target="_blank">
          <span class="material-icons">description</span>
          Plantilla informe
        </a>
      </div>
    </div>

    <div style="margin-top:14px; display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;" *ngIf="eventos.length">
      <a class="card" style="display:block;" *ngFor="let e of eventos" [routerLink]="['/eventos/' + e.id]">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
          <div style="font-weight:700;">{{e.titulo}}</div>
          <span class="badge">{{e.ambito}}</span>
        </div>
        <div style="margin-top:8px; color:#6b7280; font-size:13px;">{{e.fecha}} · {{e.lugar}}</div>
        <div style="margin-top:10px; color:#374151;">{{e.descripcion}}</div>
      </a>
    </div>

    <div class="card" style="margin-top:14px;" *ngIf="!eventos.length">
      No hay eventos aprobados todavía.
    </div>
  </div>
-->
    <div class="container">
      <!-- TITULO -->
      <div class="header-eventos">
        <div>
          <h2>Eventos interculturales</h2>
          <p>Explora los eventos disponibles y participa.</p>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="filtros">
        <div class="campo">
          <input
            type="text"
            placeholder="Buscar evento..."
            [(ngModel)]="textoBusqueda"
            (input)="filtrar()"
          />
        </div>
        <div class="campo">
          <select [(ngModel)]="filtroAmbito" (change)="filtrar()">
            <option value="">Todos</option>
            <option value="FACULTAD">Facultad</option>
            <option value="CARRERA">Carrera</option>
          </select>
        </div>
        <div class="campo">
          <input type="date" [(ngModel)]="fechaFiltro" (change)="filtrar()" />
        </div>
      </div>
      <!-- EVENTOS -->
      <div class="grid-eventos">
        <div class="evento-card" *ngFor="let e of eventosFiltrados; trackBy: trackById">
          
          <img
            class="evento-img"
            [src]="e.rutaImagen ? apiUrl + e.rutaImagen : '/uteq.png'"
            (error)="onImgError($event)"
          />

          <div class="evento-body">
            <div class="evento-header">
              <h3>{{ e.titulo }}</h3>
              <span class="badge">{{ e.ambito }}</span>
            </div>

            <div class="evento-info"><b>Lugar:</b> {{ e.lugar }}</div>

            <div class="evento-info"><b>Fecha:</b> {{ e.fecha }}</div>

            <p class="evento-desc">
              {{ e.descripcion }}
            </p>

            <div class="evento-actions">
              <button class="btn-verde" [routerLink]="['/dashboard/eventos', e.id]">Abrir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EventosPage implements OnInit {
  eventos: EventoDto[] = [];
  textoBusqueda = '';
  filtroAmbito = '';
  fechaFiltro = '';

  eventosFiltrados: EventoDto[] = [];
  apiUrl = 'https://www.lexusinformatics.com/Sistema_Eventos/';

  constructor(private eventoService: EventoService,private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
  }
 cargar() {
  this.eventoService.publicos().subscribe({
    next: (data) => {
      this.eventos = data || [];
      this.eventosFiltrados = [...this.eventos]; // nueva referencia
      this.cd.detectChanges(); // fuerza actualización de la vista
    }
  });
}

  filtrar() {
    this.eventosFiltrados = this.eventos.filter((e) => {
      const coincideTexto =
        !this.textoBusqueda || e.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase());

      const coincideAmbito = !this.filtroAmbito || e.ambito === this.filtroAmbito;

      const coincideFecha = !this.fechaFiltro || e.fecha.includes(this.fechaFiltro);

      return coincideTexto && coincideAmbito && coincideFecha;
    });
  }
  onImgError(event: any) {
    event.target.src = '/uteq.png';
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
