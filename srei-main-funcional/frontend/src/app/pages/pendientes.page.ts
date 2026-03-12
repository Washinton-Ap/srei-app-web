import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventoService, EventoDto } from '../core/services/evento.service';
import { ChangeDetectorRef } from '@angular/core';// para forzarlo que funcione con un solo click


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="card">
    <h2 style="margin:0;">{{titulo}}</h2>
    <p style="margin-top:8px; color:#6b7280;">Aprueba o rechaza eventos pendientes según tu rol.</p>

    <div *ngIf="mensaje" class="card" style="margin-top:12px; border-left:4px solid;" [ngStyle]="{ 'border-left-color': tipoMensaje === 'ok' ? '#16a34a' : '#dc2626' }">
      <div [style.color]="tipoMensaje === 'ok' ? '#166534' : '#991b1b'" style="font-weight:600;">{{mensaje}}</div>
    </div>

    <div class="card" style="margin-top:12px;" *ngFor="let e of eventos">
      <div style="display:flex; justify-content:space-between; gap:10px;">
        <div>
          <div style="font-weight:700;">{{e.titulo}}</div>
          <div style="color:#6b7280; font-size:13px;">{{e.fecha}} · {{e.lugar}} · {{e.ambito}}</div>
          <div style="margin-top:8px;">{{e.descripcion}}</div>
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
            <a *ngIf="e.rutaInformePdf" class="btn" [href]="apiUrl + e.rutaInformePdf" target="_blank">
              <span class="material-icons">picture_as_pdf</span>
              Ver informe
            </a>
            <a *ngIf="e.rutaImagen" class="btn" [href]="apiUrl + e.rutaImagen" target="_blank">
              <span class="material-icons">image</span>
              Ver imagen
            </a>
          </div>
        </div>
        <span class="badge">{{e.estado}}</span>
      </div>

      <div style="margin-top:10px;">
        <label>Observaciones</label>
        <input class="input" [(ngModel)]="observaciones[e.id]" placeholder="Obligatorio si rechazas" />
      </div>

      <div style="margin-top:10px; display:flex; gap:10px;">
        <button type="button" class="btn btn-primary" (click)="decidir(e.id, 'APROBADO')">
          <span class="material-icons">check_circle</span>
          Aprobar
        </button>
        <button type="button" class="btn btn-warn" (click)="decidir(e.id, 'RECHAZADO')">
          <span class="material-icons">cancel</span>
          Rechazar
        </button>
      </div>
    </div>

    <div class="card" style="margin-top:12px;" *ngIf="!eventos.length">
      No hay eventos pendientes.
    </div>
  </div>
  `
})
export class PendientesPage {
  apiUrl = 'http://localhost:8080/';
  imagenUrl(id: number) { return `http://localhost:8080/api/eventos/${id}/imagen`; }
  informeUrl(id: number) { return `http://localhost:8080/api/eventos/${id}/informe`; }

  tipo: 'decano' | 'coordinador' = 'decano';
  titulo = 'Pendientes';

  eventos: EventoDto[] = [];
  observaciones: Record<number, string> = {};

  mensaje = '';
  tipoMensaje: 'ok' | 'error' = 'ok';

  constructor(private eventoService: EventoService, private route: ActivatedRoute,private cd: ChangeDetectorRef) {
    const url = this.route.snapshot.url.map(u => u.path).join('/');
    if (url.includes('coordinador')) {
      this.tipo = 'coordinador';
      this.titulo = 'Pendientes (Coordinación)';
    } else {
      this.tipo = 'decano';
      this.titulo = 'Pendientes (Decano)';
    }
  }

  ngOnInit() { this.cargar(); }

  cargar() {
    this.mensaje = '';
    const handler = {
     // next: (d: EventoDto[]) => (this.eventos = d || []),
      
      next: (d: EventoDto[]) => {
      this.eventos = d || [];
      this.cd.detectChanges(); // fuerza actualización de la vista
    },
      
      error: (err: any) => {
        this.eventos = [];
        this.tipoMensaje = 'error';
        const msg = err?.error?.message || err?.message || 'Error al cargar pendientes';
        this.mensaje = msg;
      }
    };
    if (this.tipo === 'decano') this.eventoService.pendientesDecano().subscribe(handler);
    else this.eventoService.pendientesCoordinador().subscribe(handler);
  }

  decidir(id: number, estado: 'APROBADO' | 'RECHAZADO') {
    const obs = (this.observaciones[id] || '').trim();
    if (estado === 'RECHAZADO' && !obs) {
      this.tipoMensaje = 'error';
      this.mensaje = 'Para rechazar debes escribir una observación/motivo.';
      return;
    }

    this.eventoService.decidir(id, estado, obs).subscribe({
      next: () => {
        this.tipoMensaje = 'ok';
        this.mensaje = estado === 'APROBADO' ? 'Evento aprobado correctamente.' : 'Evento rechazado y observación enviada.';
        this.cargar();
      },
      error: (err: any) => {
        this.tipoMensaje = 'error';
        const msg = err?.error?.message || err?.message || 'No se pudo registrar la decisión.';
        this.mensaje = msg;
      }
    });
  }
}
