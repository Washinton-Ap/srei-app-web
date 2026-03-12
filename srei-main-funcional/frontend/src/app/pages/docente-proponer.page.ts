import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../core/services/evento.service';
import { CarreraDto, FacultadDto, FacultadService } from '../core/services/facultad.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click

const MAPA_FACULTAD_CARRERAS: Record<string, string[]> = {
  'Ciencias de la Computación': ['Software', 'Telemática', 'Sistemas'],
  'Ciencias Empresariales': ['Contabilidad', 'Economía'],
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2 style="margin:0;">Proponer evento</h2>
      <p style="margin-top:8px; color:#6b7280;">
        Completa la información, sube imagen y PDF del informe.
      </p>

      <div class="card" style="margin-top:12px;">
        <div class="row">
          <div><label>Título</label><input class="input" [(ngModel)]="titulo" /></div>
          <div><label>Fecha</label><input class="input" type="date" [(ngModel)]="fecha" /></div>
        </div>

        <div style="margin-top:12px;">
          <label>Descripción</label>
          <textarea class="input" style="min-height:90px" [(ngModel)]="descripcion"></textarea>
        </div>

        <div style="margin-top:12px;">
          <label>Lugar</label><input class="input" [(ngModel)]="lugar" />
        </div>

        <div class="row" style="margin-top:12px;">
          <div>
            <label>Ámbito</label>
            <select class="input" [(ngModel)]="ambito" (ngModelChange)="onCambiarAmbito($event)">
              <option value="FACULTAD">FACULTAD</option>
              <option value="CARRERA">CARRERA</option>
            </select>
          </div>
          <div>
            <label>Facultad</label>
            <select
              class="input"
              [(ngModel)]="facultadId"
              (ngModelChange)="onCambiarFacultad($event)"
            >
              <option [ngValue]="null" disabled>Seleccione una facultad</option>
              <option *ngFor="let f of facultades" [ngValue]="f.idfacultad">
                {{ f.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="row" style="margin-top:12px;">
          <div>
            <label>Carrera</label>
            <select
              class="input"
              [(ngModel)]="carreraId"
              [disabled]="!facultadId || ambito !== 'CARRERA'"
            >
              <option [ngValue]="null" disabled>Seleccione una carrera</option>
              <option *ngFor="let c of carreras" [ngValue]="c.idcarrera">
                {{ c.nombre }}
              </option>
            </select>
            <div
              style="font-size:12px; color:#6b7280; margin-top:6px;"
              *ngIf="ambito === 'FACULTAD'"
            >
              Para eventos por FACULTAD no es obligatorio seleccionar carrera.
            </div>
          </div>
          <div></div>
        </div>

        <div class="row" style="margin-top:12px;">
          <div>
            <label>Imagen</label>
            <input class="input" type="file" accept="image/*" (change)="onImagen($event)" />
          </div>
          <div>
            <label>Informe PDF</label>
            <input class="input" type="file" accept="application/pdf" (change)="onPdf($event)" />
          </div>
        </div>

        <button type="button" class="btn btn-primary" style="margin-top:12px;" (click)="guardar()">
          <span class="material-icons">publish</span>
          Enviar propuesta
        </button>

        <div *ngIf="mensaje" class="alert success" style="margin-top:12px;">
          <span class="material-icons">check_circle</span>
          <div>{{ mensaje }}</div>
        </div>

        <div *ngIf="error" class="alert error" style="margin-top:12px;">
          <span class="material-icons">error</span>
          <div>{{ error }}</div>
        </div>
      </div>
    </div>
  `,
})
export class DocenteProponerPage {
  titulo = '';
  descripcion = '';
  fecha = '';
  lugar = '';
  ambito: 'FACULTAD' | 'CARRERA' = 'FACULTAD';

  facultades: FacultadDto[] = [];
  carreras: CarreraDto[] = [];

  facultadId: number | null = null;
  carreraId: number | null = null;

  facultad = '';
  carrera = '';

  imagen: File | null = null;
  informePdf: File | null = null;
  mensaje = '';
  error = '';

  constructor(
    private eventoService: EventoService,
    private facultadService: FacultadService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // preselección opcional
    this.onCambiarAmbito(this.ambito);

    this.facultadService.facultades().subscribe({
      next: (data) => {
        this.facultades = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
      },
    });
  }

  onCambiarAmbito(valor: 'FACULTAD' | 'CARRERA') {
    this.ambito = valor;
    // si cambia a FACULTAD, no obligar carrera
    if (this.ambito === 'FACULTAD') {
      this.carrera = '';
    }
  }

  onCambiarFacultad(idfacultad: number) {
    this.facultadId = idfacultad;
    this.carreraId = null;

    this.facultadService.carrerasPorFacultad(idfacultad).subscribe({
      next: (data) => {
        this.carreras = data;
        console.log('Carreras:', data);
      },
    });
  }

  onImagen(ev: any) {
    const f: File | null = ev?.target?.files?.[0] || null;
    if (!f) {
      this.imagen = null;
      return;
    }
    if (!f.type.startsWith('image/')) {
      this.error = 'Debe seleccionar un archivo de imagen (png/jpg/webp).';
      this.imagen = null;
      ev.target.value = '';
      return;
    }
    this.imagen = f;
  }

  onPdf(ev: any) {
    const f: File | null = ev?.target?.files?.[0] || null;
    if (!f) {
      this.informePdf = null;
      return;
    }
    if (f.type !== 'application/pdf') {
      this.error = 'Debe seleccionar un archivo PDF.';
      this.informePdf = null;
      ev.target.value = '';
      return;
    }
    this.informePdf = f;
  }

  guardar() {
    this.mensaje = '';
    this.error = '';

    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    if (!roles.includes('DOCENTE')) {
      this.error = 'Solo un usuario con rol DOCENTE puede proponer eventos.';
      return;
    }

    if (!this.titulo.trim()) {
      this.error = 'Debe ingresar el título.';
      return;
    }
    if (!this.fecha) {
      this.error = 'Debe seleccionar la fecha.';
      return;
    }
    if (!this.lugar.trim()) {
      this.error = 'Debe ingresar el lugar.';
      return;
    }
    if (!this.facultad) {
      this.error = 'Debe seleccionar la facultad.';
      return;
    }

    if (this.ambito === 'CARRERA' && !this.carrera) {
      this.error = 'Debe seleccionar la carrera.';
      return;
    }

    this.eventoService
      .proponer({
        titulo: this.titulo,
        descripcion: this.descripcion,
        fecha: this.fecha,
        lugar: this.lugar,
        ambito: this.ambito,
        facultad: String(this.facultadId),
        carrera: this.carreraId ? String(this.carreraId) : undefined,
        imagen: this.imagen,
        informePdf: this.informePdf,
      })
      .subscribe({
        next: (e) => {
          this.mensaje = 'Evento registrado. Estado: ' + e.estado;
          this.titulo = this.descripcion = this.fecha = this.lugar = '';
          this.facultad = '';
          this.carrera = '';
          this.carreras = [];
          this.imagen = this.informePdf = null;
        },
        error: (e) => {
          if (e?.status === 0) {
            this.error =
              'No se pudo conectar con el servidor. Verifica que el backend esté en http://localhost:8080.';
            return;
          }
          const msg = e?.error?.message || e?.error?.error || e?.message;
          this.error = msg
            ? String(msg)
            : `No se pudo registrar el evento (HTTP ${e?.status || '???'}).`;
        },
      });
  }
}
