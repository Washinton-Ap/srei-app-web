import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../core/services/evento.service';
import { CarreraDto, FacultadDto, FacultadService } from '../core/services/facultad.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click
import { RouterLink } from '@angular/router';

const MAPA_FACULTAD_CARRERAS: Record<string, string[]> = {
  'Ciencias de la Computación': ['Software', 'Telemática', 'Sistemas'],
  'Ciencias Empresariales': ['Contabilidad', 'Economía'],
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
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
            <select class="input" [(ngModel)]="facultadSeleccionada" (change)="onCambiarFacultad()">
              <option [ngValue]="null" disabled>Seleccione una facultad</option>

              <option *ngFor="let f of facultades" [ngValue]="f">
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
              [(ngModel)]="carreraSeleccionada"
              [disabled]="!facultadId || ambito !== 'CARRERA'"
              (change)="onCambiarCarrera()"
            >
              <option [ngValue]="null" disabled>Seleccione una carrera</option>

              <option *ngFor="let c of carreras" [ngValue]="c">
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
  facultadSeleccionada: FacultadDto | null = null;

  carreraId: number | null = null;
  carreraSeleccionada: CarreraDto | null = null;

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
    //this.onCambiarAmbito(this.ambito);
    this.facultadService.facultades().subscribe({
      next: (data) => {
        this.facultades = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
      },
      error: () => {
        this.error = 'No se pudieron cargar las facultades';
      },
    });
  }

  onCambiarAmbito(valor: 'FACULTAD' | 'CARRERA') {
    this.ambito = valor;

    if (valor === 'FACULTAD') {
      this.carreraId = null;
    }
  }

  onCambiarFacultad() {
    const facultad = this.facultadSeleccionada as any;
    
    console.log('facultad:', this.facultadSeleccionada);
    if (!facultad) return;

    const id = facultad.id;
    this.facultadId=id;

    console.log('ID facultad:', id);

    this.facultadService.carrerasPorFacultad(id).subscribe({
      next: (data) => {
        console.log('carreras:', data);
        this.carreras = data;
         this.cd.detectChanges(); // fuerza actualización de la vista
      },
      error: (e) => {
        this.error = 'No se pudieron cargar las carreras';
        console.log('error:', e);
      },
    });
  }

  onCambiarCarrera(){
    const carrera = this.carreraSeleccionada as any;
    
    console.log('Carrera:', this.carreraSeleccionada);
    if (!carrera) return;

    const id = carrera.id;
    this.carreraId=id;

    console.log('ID carrera:', id);
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

    if (!this.titulo.trim()) {
      this.error = 'Debe ingresar el título';
      return;
    }

    if (!this.fecha) {
      this.error = 'Debe seleccionar la fecha';
      return;
    }

    if (!this.lugar.trim()) {
      this.error = 'Debe ingresar el lugar';
      return;
    }

    if (!this.facultadId) {
      this.error = 'Debe seleccionar una facultad';
      return;
    }

    if (this.ambito === 'CARRERA' && !this.carreraId) {
      this.error = 'Debe seleccionar una carrera';
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
          this.mensaje = 'Evento enviado correctamente';

          this.titulo = '';
          this.descripcion = '';
          this.fecha = '';
          this.lugar = '';

          this.facultadId = null;
          this.carreraId = null;

          this.carreras = [];

          this.imagen = null;
          this.informePdf = null;
        },

        error: () => {
          this.error = 'No se pudo registrar el evento';
        },
      });
  }
}
