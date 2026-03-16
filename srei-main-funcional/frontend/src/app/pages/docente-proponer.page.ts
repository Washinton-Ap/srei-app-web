import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../core/services/evento.service';
import { CarreraDto, FacultadDto, FacultadService } from '../core/services/facultad.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

const MAPA_FACULTAD_CARRERAS: Record<string, string[]> = {
  'Ciencias de la Computación': ['Software', 'Telemática', 'Sistemas'],
  'Ciencias Empresariales': ['Contabilidad', 'Economía'],
};

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  template: `
<ion-content>

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

            <button class="btn btn-naranja" style="margin-top:8px;" (click)="abrirModalIA()">
              <span class="material-icons">auto_awesome</span>
              Generar imagen con IA
            </button>
            <button (click)="modalIA = true">TEST MODAL</button>
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
    

 
    <!-- TODO TU FORMULARIO -->
    <!-- no cambia nada aquí -->

 

  <!-- MODAL -->
  <ion-modal [isOpen]="modalIA" (didDismiss)="cerrarModalIA()">

    <ion-header>
      <ion-toolbar>
        <ion-title>Generar imagen con IA</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarModalIA()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <p style="color:#6b7280">
        Describe la imagen que deseas para el evento
      </p>

      <textarea
        class="input"
        style="min-height:100px"
        [(ngModel)]="promptIA"
      ></textarea>

      <div style="margin-top:15px">
        <button class="btn btn-verde" (click)="generarImagenIA()">
          Generar
        </button>
      </div>

      <div *ngIf="previewIA" style="margin-top:15px">
        <img [src]="previewIA" style="width:100%; border-radius:8px" />
      </div>

    </ion-content>

  </ion-modal>

</ion-content>

  `,
})
export class DocenteProponerPage {
  //variable IA
  modalIA = false;

  promptIA = '';

  previewIA: string | null = null;
  // fin variable IA
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
    this.facultadId = id;

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

  onCambiarCarrera() {
    const carrera = this.carreraSeleccionada as any;

    console.log('Carrera:', this.carreraSeleccionada);
    if (!carrera) return;

    const id = carrera.id;
    this.carreraId = id;

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

        facultad: String(this.facultadSeleccionada?.nombre),
        carrera: String(this.carreraSeleccionada?.nombre),

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

  //Funciones con IA
  generarImagenIA() {
    if (!this.promptIA.trim()) {
      this.error = 'Debe escribir una descripción';
      return;
    }

    this.eventoService.generarImagenIA(this.promptIA).subscribe({
      next: (data: any) => {
        this.previewIA = data.url;

        fetch(data.url)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'evento.png', { type: 'image/png' });

            this.imagen = file;
          });
        this.cd.detectChanges(); // fuerza actualización de la vista
      },

      error: () => {
        this.error = 'No se pudo generar la imagen';
      },
    });
  }
  abrirModalIA() {
    this.modalIA = true;
    this.cd.detectChanges(); // fuerza actualización de la vista
  }

  cerrarModalIA() {
    this.modalIA = false;
    this.cd.detectChanges(); // fuerza actualización de la vista
  }
}
