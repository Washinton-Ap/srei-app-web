import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoDto, EventoService } from '../core/services/evento.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="page">
    <div class="page-header" style="display:flex; align-items:flex-end; justify-content:space-between; gap:12px;">
      <div>
        <h1 style="margin:0;">Eventos rechazados</h1>
        <p style="margin:6px 0 0; color:var(--muted);">Revisa la observación y reenvía el evento para aprobación.</p>
      </div>
      <button class="btn" type="button" (click)="cargar()">
        <span class="material-icons">refresh</span>
        Actualizar
      </button>
    </div>

    <div *ngIf="!eventos.length" class="card" style="margin-top:12px;">No hay eventos rechazados.</div>

    <div *ngFor="let e of eventos" class="card" style="margin-top:12px;">
      <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
        <div>
          <div style="font-weight:800; font-size:16px;">{{e.titulo}}</div>
          <div style="color:var(--muted); margin-top:4px;">{{e.fecha}} · {{e.lugar}} · {{e.ambito}}</div>
        </div>
        <div class="pill" style="background:#fee2e2; color:#991b1b;">RECHAZADO</div>
      </div>

      <div style="margin-top:10px; padding:10px; border:1px dashed var(--borde); border-radius:12px;">
        <div style="font-weight:700;">Observación / motivo del rechazo</div>
        <div style="margin-top:6px; color:#374151; white-space:pre-wrap;">{{e.observaciones || 'Sin observación'}}</div>
      </div>

      <details style="margin-top:12px;">
        <summary style="cursor:pointer; font-weight:700;">Editar y reenviar</summary>

        <div style="margin-top:10px; display:grid; gap:10px;">
          <div class="grid-2">
            <div>
              <label>Título</label>
              <input class="input" [(ngModel)]="e.titulo" />
            </div>
            <div>
              <label>Fecha</label>
              <input class="input" type="date" [(ngModel)]="e.fecha" />
            </div>
          </div>

          <div>
            <label>Descripción</label>
            <textarea class="input" rows="3" [(ngModel)]="e.descripcion"></textarea>
          </div>

          <div>
            <label>Lugar</label>
            <input class="input" [(ngModel)]="e.lugar" />
          </div>

          <div class="grid-2">
            <div>
              <label>Facultad</label>
              <input class="input" [(ngModel)]="e.facultad" />
            </div>
            <div>
              <label>Carrera</label>
              <input class="input" [(ngModel)]="e.carrera" />
            </div>
          </div>

          <div class="grid-2">
            <div>
              <label>Imagen (opcional)</label>
              <input class="input" type="file" (change)="onFile($event, e, 'img')" accept="image/*" />
            </div>
            <div>
              <label>Informe PDF (opcional)</label>
              <input class="input" type="file" (change)="onFile($event, e, 'pdf')" accept="application/pdf" />
            </div>
          </div>

          <button class="btn primary" type="button" (click)="reenviar(e)">
            <span class="material-icons">send</span>
            Reenviar a aprobación
          </button>

          <div *ngIf="mensaje" class="toast ok">{{mensaje}}</div>
          <div *ngIf="error" class="toast err">{{error}}</div>
        </div>
      </details>
    </div>
  </div>
  `
})
export class DocenteRechazadosPage {
  eventos: (EventoDto & { _img?: File | null; _pdf?: File | null })[] = [];
  mensaje = '';
  error = '';

  constructor(private eventoService: EventoService) {
    this.cargar();
  }

  cargar() {
    this.mensaje = '';
    this.error = '';
    this.eventoService.misEventos('RECHAZADO').subscribe({
      next: (d) => (this.eventos = (d || []) as any),
      error: (e) => (this.error = e?.error?.message || 'No se pudo cargar eventos rechazados')
    });
  }

  onFile(ev: any, e: any, tipo: 'img' | 'pdf') {
    const f: File | null = ev?.target?.files?.[0] || null;
    if (tipo === 'img') e._img = f;
    if (tipo === 'pdf') e._pdf = f;
  }

  reenviar(e: any) {
    this.mensaje = '';
    this.error = '';
    this.eventoService
      .reenviar(e.id, {
        titulo: e.titulo,
        descripcion: e.descripcion,
        fecha: e.fecha,
        lugar: e.lugar,
        ambito: e.ambito,
        facultad: e.facultad,
        carrera: e.carrera,
        imagen: e._img,
        informePdf: e._pdf
      })
      .subscribe({
        next: () => {
          this.mensaje = 'Evento reenviado correctamente. Estado: PENDIENTE';
          this.cargar();
        },
        error: (err) => (this.error = err?.error?.message || 'No se pudo reenviar')
      });
  }
}
