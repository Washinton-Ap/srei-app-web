import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoDto, EventoService } from '../core/services/evento.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click
import { AlertService } from '../core/services/alert.service';
import { ConstantPool } from '@angular/compiler';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div
        class="page-header"
        style="display:flex; align-items:flex-end; justify-content:space-between; gap:12px;"
      >
        <div>
          <h1 style="margin:0;">Eventos rechazados</h1>
          <p style="margin:6px 0 0; color:var(--muted);">
            Revisa la observación y reenvía el evento para aprobación.
          </p>
        </div>
        <!--
        <button class="btn" type="button" (click)="cargar()">
          <span class="material-icons">refresh</span>
          Actualizar
        </button> -->
      </div>

      <div *ngIf="!eventos.length" class="card" style="margin-top:12px;">
        No hay eventos rechazados.
      </div>

      <div *ngFor="let e of eventos" class="card" style="margin-top:12px;">
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div>
            <div style="font-weight:800; font-size:16px;">{{ e.titulo }}</div>
            <div style="color:var(--muted); margin-top:4px;">
              {{ e.fecha }} · {{ e.lugar }} · {{ e.ambito }}
            </div>
          </div>
          <div class="pill" style="background:#fee2e2; color:#991b1b;">RECHAZADO</div>
        </div>

        <div
          style="margin-top:10px; padding:10px; border:1px dashed var(--borde); border-radius:12px;"
        >
          <div style="font-weight:700;">Observación / motivo del rechazo</div>
          <div style="margin-top:6px; color:#374151; white-space:pre-wrap;">
            {{ e.observaciones || 'Sin observación' }}
          </div>
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
                <input class="input" type="date" [(ngModel)]="e.fecha" [min]="minDate" />
              </div>
              <div>
                <label>Hora</label>
                <input class="input" type="time" [(ngModel)]="e.hora" />
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
                <input class="input" [readonly]="true" [(ngModel)]="e.facultad" />
              </div>
              <div>
                <label>Carrera</label>
                <input class="input" [readonly]="true" [(ngModel)]="e.carrera" />
              </div>
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
                    <input
                      class="input"
                      type="file"
                      accept="image/*"
                      (change)="onFile($event, e, 'img')"
                    />
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
                      (click)="generarImagenIA(e)"
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
                <input
                  class="input"
                  type="file"
                  accept="application/pdf"
                  (change)="onFile($event, e, 'pdf')"
                />
              </div>
            </div>

            <button class="btn btn-verde" type="button" (click)="reenviar(e)">
              <span class="material-icons">send</span>
              Reenviar a aprobación
            </button>

            <div *ngIf="mensaje" class="toast ok">{{ mensaje }}</div>
            <div *ngIf="error" class="toast err">{{ error }}</div>
          </div>
        </details>
      </div>
    </div>
  `,
})
export class DocenteRechazadosPage {
  //variable IA
  promptIA: string = '';
  previewIA: string | null = null;
  modalIA = false;

  modoImagen: 'SUBIR' | 'IA' = 'SUBIR';
  // fin variable IA
  imagen: File | null = null;

  informePdf: File | null = null;

  eventos: (EventoDto & { _img?: File | null; _pdf?: File | null })[] = [];
  mensaje = '';
  error = '';
  hora = '';
  fecha = '';
  minDate = '';

  constructor(
    private eventoService: EventoService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService,
  ) {
    const today = new Date();
    // Sumar 1 día para que sea mañana
    today.setDate(today.getDate() + 1);

    // Formatear a YYYY-MM-DD
    this.minDate = today.toISOString().split('T')[0];
    this.cargar();
  }

  cargar() {
    this.mensaje = '';
    this.error = '';
    this.alertService.loading();

    this.eventoService.misEventos('RECHAZADO').subscribe({
      next: (d) => {
        this.eventos = (d || []).map((e: any) => {
          console.log("objeto"+e.rutaInformePdf);
          if (e.fecha) {
            const fechaObj = new Date(e.fecha);

            return {
              ...e,
              hora: fechaObj.toTimeString().slice(0, 5), // HH:mm
              fecha: fechaObj.toISOString().split('T')[0], // yyyy-MM-dd
            };
          }
          

          if (e.rutaImagen) {
            this.convertirUrlAFile(e.rutaImagen!, 'evento.png')
  .then(file => this.imagen = file);


          }
          if (e.rutaInformePdf) {
           this.convertirUrlAFile(e.rutaInformePdf!, 'informe.pdf')
  .then(file => this.informePdf = file);
          }

          return e;
        });
        this.alertService.close();
        this.cd.detectChanges();
      },

      error: (e) => this.alertService.warning('No se pudo cargar eventos rechazados'),
    });
  }

  onFile(ev: any, e: any, tipo: 'img' | 'pdf') {
    const f: File | null = ev?.target?.files?.[0] || null;
    if (tipo === 'img') this.imagen = f;
    if (tipo === 'pdf') this.informePdf = f;
  }

  reenviar(e: any) {
    this.alertService.loading();
    this.mensaje = '';
    this.error = '';
    this.eventoService
      .reenviar(e.id, {
        titulo: e.titulo,
        descripcion: e.descripcion,
        fecha: e.fecha,
        lugar: e.lugar,
        ambito: e.ambito,
        hora: e.hora,
        facultad: e.facultad,
        carrera: e.carrera,
        imagen: this.imagen,
        informePdf: this.informePdf,
      })
      .subscribe({
        next: () => {
          //this.mensaje = 'Evento reenviado correctamente. Estado: PENDIENTE';

          this.alertService.close();
          this.alertService.success('Evento reenviado correctamente. Estado actual: PENDIENTE');
          this.cd.detectChanges();
        },
        error: (err) => this.alertService.error('No se pudo reenviar el evento'),
        
      });
  }
  generarImagenIA(e: any) {
    if (!this.promptIA.trim()) {
      this.alertService.warning('Debe escribir una descripción');
      return;
    }
    this.alertService.loading();

    this.eventoService.generarImagenIA(this.promptIA).subscribe({
      next: (data: any) => {
        this.previewIA = data.url;

        //console.log('Imagen con IA' + data.url);

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

        e._img = new File([blob], 'evento.png', { type: 'image/png' });

        this.cd.detectChanges();
      },

      error: () => {
        this.alertService.warning('No se pudo generar la imagen');
      },
    });
  }
  convertirUrlAFile(url: string, defaultName: string): Promise<File> {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => new File(
      [blob],
      url.split('/').pop() || defaultName,
      { type: blob.type }
    ));
}

 
}
