import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../core/services/evento.service';
import { CarreraDto, FacultadDto, FacultadService } from '../core/services/facultad.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertService } from '../core/services/alert.service';

const MAPA_FACULTAD_CARRERAS: Record<string, string[]> = {
  'Ciencias de la Computación': ['Software', 'Telemática', 'Sistemas'],
  'Ciencias Empresariales': ['Contabilidad', 'Economía'],
};
declare var puter: any;

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],

  template: `
    <div class="card">
      <h2 style="margin:0;">Proponer evento</h2>
      <p style="margin-top:8px; color:#6b7280;">
        Completa la información, sube imagen y PDF del informe.
      </p>

      <div class="card" style="margin-top:12px;">
        <div class="row">
          <div><label>Título</label><input class="input" [(ngModel)]="titulo" /></div>
          <div>
            <label>Fecha</label
            ><input class="input" type="date" [(ngModel)]="fecha" [min]="minDate" />
          </div>
          <div><label>Hora</label><input class="input" type="time" [(ngModel)]="hora" /></div>
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
            <div>
              <label>Imagen del evento</label>

              <div style="display:flex; gap:20px; margin-top:8px;">
                <label>
                  <input type="radio" [(ngModel)]="modoImagen" value="SUBIR" />
                  Subir imagen
                </label>

                <label>
                  <input type="radio" [(ngModel)]="modoImagen" value="IA" />
                  Generar con IA
                </label>
              </div>

              <!-- SUBIR IMAGEN -->
              <div *ngIf="modoImagen === 'SUBIR'" style="margin-top:10px;">
                <input class="input" type="file" accept="image/*" (change)="onImagen($event)" />
              </div>

              <!-- GENERAR CON IA -->
              <div *ngIf="modoImagen === 'IA'" style="margin-top:10px;">
                <textarea
                  class="input"
                  style="min-height:80px"
                  [(ngModel)]="promptIA"
                  placeholder="Ejemplo: evento universitario tecnológico con estudiantes y computadoras"
                ></textarea>

                <button
                  type="button"
                  class="btn btn-naranja"
                  style="margin-top:8px;"
                  (click)="generarImagenIA()"
                >
                  <span class="material-icons">auto_awesome</span>
                  Generar imagen
                </button>
              </div>

              <!-- PREVIEW -->
              <div *ngIf="previewIA" style="margin-top:10px;">
                <img [src]="previewIA" style="width:250px; border-radius:10px;" />
              </div>
            </div>
          </div>

          <div>
            <label>Informe PDF</label>
            <input class="input" type="file" accept="application/pdf" (change)="onPdf($event)" />
          </div>
        </div>

        <button type="button" class="btn btn-verde" style="margin-top:12px;" (click)="guardar()">
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
  //variable IA
  promptIA: string = '';
  previewIA: string | null = null;
  modalIA = false;

  modoImagen: 'SUBIR' | 'IA' = 'SUBIR';
  // fin variable IA
  titulo = '';
  descripcion = '';
  fecha = '';
  lugar = '';
  hora = '';

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
  minDate = '';

  constructor(
    private eventoService: EventoService,
    private facultadService: FacultadService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef,
  ) {
    const today = new Date();
    // Sumar 1 día para que sea mañana
    today.setDate(today.getDate() + 1);

    // Formatear a YYYY-MM-DD
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    // preselección opcional
    //this.onCambiarAmbito(this.ambito);
    this.facultadService.facultades().subscribe({
      next: (data) => {
        this.facultades = data;
        this.cd.detectChanges(); // fuerza actualización de la vista
      },
      error: () => {
        this.alertService.warning('No se pudieron cargar las facultades');
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
        this.alertService.warning('No se pudieron cargar las carreras');
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
      this.alertService.warning('Debe seleccionar un archivo de imagen (png/jpg/webp).');
      this.imagen = null;
      ev.target.value = '';
      return;
    }
    this.imagen = f;
    console.log(this.imagen);
  }

  onPdf(ev: any) {
    const f: File | null = ev?.target?.files?.[0] || null;
    if (!f) {
      this.informePdf = null;
      return;
    }
    if (f.type !== 'application/pdf') {
      this.alertService.warning('Debe seleccionar un archivo PDF.');
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
      //this.error = 'Debe ingresar el título';
      this.alertService.warning('Debe ingresar el título');
      return;
    }

    if (!this.fecha) {
      //this.error = 'Debe seleccionar la fecha';
      this.alertService.warning('Debe seleccionar la fecha');
      return;
    }
    if (!this.fecha) {
      this.alertService.warning('Debe seleccionar la hora');
      return;
    }

    if (!this.lugar.trim()) {
      this.alertService.warning('Debe ingresar el lugar');
      return;
    }

    if (!this.facultadId) {
      this.alertService.warning('Debe seleccionar una facultad');
      return;
    }

    if (this.ambito === 'CARRERA' && !this.carreraId) {
      this.alertService.warning('Debe seleccionar una carrera');
      return;
    }
    const confirmar = this.alertService.confirm('¿Desea enviar el evento?');

    if (!confirmar) return;

    this.alertService.loading();

    this.eventoService
      .proponer({
        titulo: this.titulo,
        descripcion: this.descripcion,
        fecha: this.fecha,
        lugar: this.lugar,
        ambito: this.ambito,
        hora: this.hora,

        facultad: String(this.facultadSeleccionada?.nombre),
        carrera: String(this.carreraSeleccionada?.nombre),

        imagen: this.imagen,
        informePdf: this.informePdf,
      })
      .subscribe({
        next: (e) => {
          this.Alertmensaje(1, 'Evento enviado correctamente');

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
          this.Alertmensaje(5, 'No se pudo registrar el evento');
        },
      });
  }

  //Funciones con IA

  generarImagenIA() {
    if (!this.promptIA.trim()) {
      this.alertService.warning('Debe escribir una descripción');
      return;
    }
    this.alertService.loading();

    this.eventoService.generarImagenIA(this.promptIA).subscribe({
      next: (data: any) => {
        this.previewIA = data.url;
        console.log('Imagen con IA' + data.url);
        this.alertService.close();
        this.alertService.success('Imagen generada con exito');
        /*
        fetch(data.url)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], 'evento.png', { type: 'image/png' });

            this.imagen = file;
          });*/

        const base64 = data.url.split(',')[1];
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        this.imagen = new File([blob], 'evento.png', { type: 'image/png' });
        console.log("imagen_generada"+this.imagen);
        this.cd.detectChanges();
      },

      error: () => {
        this.alertService.warning('No se pudo generar la imagen');
      },
    });
  }

  /*
  async generarImagenIA() {
    if (!this.promptIA.trim()) {
      alert('Escribe una descripción');
      return;
    }

    try {
      const img = await puter.ai.image({
        prompt: this.promptIA,
        size: '1024x1024',
      });

      this.previewIA = img.url;

      // Convertir la imagen a File para enviarla al backend
      const res = await fetch(img.url);
      const blob = await res.blob();

      this.imagen = new File([blob], 'evento.png', {
        type: 'image/png',
      });
    } catch (error) {
      console.error(error);
      alert('Error generando la imagen');
    }
  }
    */

  Alertmensaje(tipo: number, message: string) {
    /* tipo
     1 suceess
     2 warning
     3 loading
     4 erorsin carga
     5 errorcargar

  */
    switch (tipo) {
      case 1:
        this.alertService.close();
        this.alertService.success(message);
        break;

      case 2:
        this.alertService.warning(message);
        break;

      case 3:
        this.alertService.loading();
        break;
      case 4:
        this.alertService.error(message);
        break;
      case 5:
        this.alertService.close();
        this.alertService.error(message);
        break;
    }
  }
}
