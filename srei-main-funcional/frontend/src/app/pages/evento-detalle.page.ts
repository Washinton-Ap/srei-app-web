import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from './topbar.component';
import { EventoService, EventoDto } from '../core/services/evento.service';
import { ComentarioService, ComentarioDto } from '../core/services/comentario.service';
import { AsistenciaService, QrDto } from '../core/services/asistencia.service';
import { TriviaService, PreguntaDto, RankingItemDto } from '../core/services/trivia.service';
import { ChangeDetectorRef } from '@angular/core'; // para forzarlo que funcione con un solo click
import { RouterLink } from '@angular/router';
import { AlertService } from '../core/services/alert.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!--<app-topbar />-->
    <div class="container">
      <div class="card" *ngIf="cargando">Cargando evento...</div>

      <div class="card" *ngIf="!cargando && errorCarga" style="border-left:4px solid #dc2626;">
        <div style="font-weight:700; color:#991b1b;">No se pudo cargar el evento</div>
        <div style="margin-top:6px;">{{ errorCarga }}</div>
      </div>

      <div *ngIf="evento">
        <div class="card">
          <div
            style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;"
          >
            <div>
              <h2 style="margin:0;">{{ evento.titulo }}</h2>
              <div style="margin-top:6px; color:#6b7280;">
                {{ evento.fecha }} · {{ evento.lugar }} · {{ evento.ambito }}
              </div>
              <div
                style="margin-top:6px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;"
              >
                <span class="pill">Estado: {{ evento.estado }}</span>
                <span class="pill" *ngIf="evento.facultad">Facultad: {{ evento.facultad }}</span>
                <span class="pill" *ngIf="evento.carrera">Carrera: {{ evento.carrera }}</span>
                <span class="pill" *ngIf="evento.docenteCorreo"
                  >Docente: {{ evento.docenteCorreo }}</span
                >
              </div>
              <div
                *ngIf="evento.estado === 'RECHAZADO' && evento.observaciones"
                class="card"
                style="margin-top:10px; border-left:4px solid #b91c1c;"
              >
                <div style="font-weight:800; color:#991b1b;">Observación del rechazo</div>
                <div style="margin-top:6px; white-space:pre-wrap;">{{ evento.observaciones }}</div>
              </div>
              <p style="margin-top:10px;">{{ evento.descripcion }}</p>

              <div *ngIf="imagenPublicaUrl" style="margin-top:12px;">
                <div style="font-weight:700; margin-bottom:8px;">Imagen del evento</div>
                <img
                  class="evento-img"
                  [src]="imagenPublicaUrl ? imagenPublicaUrl : '/uteq.png'"
                  (error)="onImgError($event)"
                  style="max-width:100%; border-radius:14px; border:1px solid var(--borde);"
                />
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <!-- <button type="button"  *ngIf="evento.rutaInformePdf && (esDecano || esCoordinador || esAdmin)" class="btn btn-oscuro"  (click)="abrirInforme()">
            <span class="material-icons">picture_as_pdf</span>
            Ver informe PDF
          </button> -->
              <a
                class="btn btn-oscuro"
                *ngIf="evento.rutaInformePdf && (esDecano || esCoordinador || esAdmin)"
                [href]="imagenPublicaUrl ? this.apiFileUrl(evento.rutaInformePdf) :this.apiFileUrl('uploads/uteq.png')"
                (error)="onImgError($event)"
                target="_blank"
              >
                <span class="material-icons">picture_as_pdf</span>
                Ver informe PDF
              </a>

              <a
                *ngIf="imagenPublicaUrl"
                class="btn btn-naranja"
                [href]="imagenPublicaUrl ? imagenPublicaUrl : this.apiFileUrl('uploads/uteq.png')"
                (error)="onImgError($event)"
                target="_blank"
              >
                <span class="material-icons">image</span>
                Ver imagen
              </a>

              <button
                type="button"
                class="btn btn-naranja"
                (click)="asistir()"
                [disabled]="evento.estado !== 'APROBADO'"
              >
                <span class="material-icons">qr_code</span>
                Asistir (QR)
              </button>
              <!--<button type="button" class="btn btn-naranja" (click)="cargarTrivia()">
                <span class="material-icons">quiz</span>
                Trivia
              </button> -->
            </div>
          </div>

          <div
            *ngIf="qr"
            style="margin-top:14px; display:flex; gap:14px; align-items:flex-start; flex-wrap:wrap;"
          >
            <img
              [src]="'data:image/png;base64,' + qr.pngBase64"
              width="160"
              height="160"
              style="border:1px solid var(--borde); border-radius:12px; padding:8px; background:white;"
            />
            <div style="min-width:260px;">
              <div style="font-weight:700;">Tu código QR</div>
              <div style="color:#6b7280; font-size:13px; margin-top:6px;">
                Escanéalo para confirmar asistencia.
              </div>

              <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn btn-verde" (click)="confirmarAsistencia()">
                  <span class="material-icons">done</span>
                  Confirmar asistencia
                </button>
                <a
                  class="btn btn-verde"
                  [href]="'http://localhost:8080/api/asistencias/confirmar?token=' + qr.token"
                  target="_blank"
                >
                  <span class="material-icons">open_in_new</span>
                  Abrir confirmación
                </a>
              </div>

              <div
                *ngIf="mensajeAsistencia"
                class="card"
                style="margin-top:10px; border-left:4px solid;"
                [ngStyle]="{
                  'border-left-color': tipoMensajeAsistencia === 'ok' ? '#16a34a' : '#dc2626',
                }"
              >
                <div
                  [style.color]="tipoMensajeAsistencia === 'ok' ? '#166534' : '#991b1b'"
                  style="font-weight:600;"
                >
                  {{ mensajeAsistencia }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="layout" style="margin-top:14px;">
          <div class="sidebar">
            <div class="card">
              <div style="font-weight:700; margin-bottom:10px;">Comentarios</div>
              <textarea
                class="input"
                style="min-height:90px;"
                [(ngModel)]="nuevoComentario"
                placeholder="Escribe un comentario..."
              ></textarea>
              <button class="btn btn-verde" style="margin-top:10px;" (click)="publicarComentario()">
                <span class="material-icons">send</span>
                Publicar
              </button>
            </div>

            <div class="card" style="margin-top:12px;" *ngIf="ranking.length">
              <div style="font-weight:700; margin-bottom:10px;">Ranking</div>
              <div
                *ngFor="let r of ranking; let i = index"
                style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--borde);"
              >
                <div>{{ i + 1 }}. {{ r.nombres }} {{ r.apellidos }}</div>
                <div style="font-weight:700;">{{ r.puntaje }}</div>
              </div>
            </div>
          </div>

          <div>
            <div class="card">
              <div style="font-weight:700; margin-bottom:10px;">Listado de comentarios</div>
              <div
                *ngFor="let c of comentarios"
                style="border-bottom:1px solid var(--borde); padding:10px 0;"
              >
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <div style="font-weight:600;">{{ c.autorCorreo }}</div>
                  <button class="btn btn-oscuro" *ngIf="esAdmin" (click)="censurar(c)">
                    <span class="material-icons">block</span>
                    {{ c.censurado ? 'Restaurar' : 'Censurar' }}
                  </button>
                </div>
                <div style="margin-top:6px; color:#374151;">{{ c.contenido }}</div>
              </div>
            </div>

            <div class="card" style="margin-top:12px;" *ngIf="preguntas.length">
              <div style="font-weight:700; margin-bottom:10px;">Trivia</div>

              <div
                *ngFor="let p of preguntas"
                style="border:1px solid var(--borde); border-radius:12px; padding:12px; margin-bottom:10px;"
              >
                <div style="font-weight:600;">{{ p.enunciado }}</div>
                <div style="margin-top:8px; display:grid; gap:8px;">
                  <button
                    class="btn"
                    *ngFor="let op of p.opciones; let idx = index"
                    (click)="responder(p.id, idx)"
                  >
                    <span class="material-icons">radio_button_unchecked</span>
                    {{ op }}
                  </button>
                </div>
              </div>
            </div>

            <div *ngIf="mensajeTrivia" class="badge">{{ mensajeTrivia }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class EventoDetallePage {
  evento: EventoDto | null = null;
  cargando = false;
  errorCarga = '';
  comentarios: ComentarioDto[] = [];
  nuevoComentario = '';
  qr: QrDto | null = null;

  imagenPublicaUrl = '';

  preguntas: PreguntaDto[] = [];
  ranking: RankingItemDto[] = [];
  mensajeTrivia = '';

  esAdmin = false;
  esDecano = false;
  esCoordinador = false;
  esAsistente = false;

  mensajeAsistencia = '';
  tipoMensajeAsistencia: 'ok' | 'error' = 'ok';

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private comentarioService: ComentarioService,
    private asistenciaService: AsistenciaService,
    private triviaService: TriviaService,
    private cd: ChangeDetectorRef,
        private alertService: AlertService,
  ) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.esAdmin = roles.includes('ADMIN');
    this.esDecano = roles.includes('DECANO');
    this.esCoordinador = roles.includes('COORDINADOR');
    this.esAsistente = roles.includes('ASISTENTE');

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDetalle(id);
  }

  private cargarDetalle(id: number) {
    //this.cargando = true;
    this.errorCarga = '';
    this.alertService.loading();
    setTimeout(() => {
    this.eventoService.detalle(id).subscribe({
      next: (e) => {
        this.evento = e;
        //this.cargando = false;
        // Imagen: se sirve pública desde /uploads/**
        this.imagenPublicaUrl = e?.rutaImagen ? this.apiFileUrl(e.rutaImagen) :  this.apiFileUrl('uploads/uteq.png');
        this.alertService.close();
        this.cd.detectChanges(); // fuerza actualización de la vista

        this.cargarComentarios();
        this.cargarRanking();
      },
      error: (err) => {
        this.cargando = false;
        const msg = err?.error?.message || err?.error?.error || err?.message;
        /*
        this.errorCarga = msg
          ? String(msg)
          : `No se pudo cargar el evento (HTTP ${err?.status || '???'}).`;
        */
          this.alertService.close();
           this.alertService.error(`No se pudo cargar el evento (HTTP ${err?.status || '???'}).`);
      },
    });}, 1000);
  }

  cargarComentarios() {
    if (!this.evento) return;
    this.comentarioService.listar(this.evento.id).subscribe({
      next: (c) => {
        this.comentarios = c || [];
        this.cargando = false;
        // Imagen: se sirve pública desde /uploads/**
        this.cd.detectChanges();
      },
    });
  }

  publicarComentario() {
    if (!this.evento) return;
    this.comentarioService.crear(this.evento.id, this.nuevoComentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.cargarComentarios();
        this.cd.detectChanges();
      },
    });
  }

  censurar(c: ComentarioDto) {
    this.comentarioService
      .censurar(c.id, !c.censurado)
      .subscribe({ next: () => this.cargarComentarios() });
  }

  asistir() {
    if (!this.evento) return;
    this.asistenciaService.asistir(this.evento.id).subscribe({ next: (qr) => (this.qr = qr) });
  }

  confirmarAsistencia() {
    if (!this.evento) return;
    this.alertService.loading
    this.mensajeAsistencia = '';
    this.asistenciaService.confirmarEvento(this.evento.id).subscribe({
      next: () => {
        //this.tipoMensajeAsistencia = 'ok';
        //this.mensajeAsistencia = 'Asistencia confirmada correctamente.';
        this.alertService.close();
        this.alertService.success("Asistencia confirmada correctamente.");

      },
      error: (e) => {
        this.tipoMensajeAsistencia = 'error';
        const msg = e?.error?.message || e?.error?.error || e?.message;
        /*
        this.mensajeAsistencia = msg
          ? String(msg)
          : `No se pudo confirmar la asistencia (HTTP ${e?.status || '???'}).`;
          this.alertService.close();
        */
          this.alertService.close();
          this.alertService.error("`No se pudo confirmar la asistencia.");
      },
    });
  }

  cargarTrivia() {
    if (!this.evento) return;
    this.triviaService
      .preguntas(this.evento.id)
      .subscribe({ 
           next: (p) => {
        this.preguntas = p || [];
        this.cd.detectChanges();

      },

      }
    
    );
  }

  responder(preguntaId: number, idx: number) {
    if (!this.evento) return;
    this.mensajeTrivia = '';
    this.triviaService.responder(this.evento.id, preguntaId, idx).subscribe({
      next: (puntos) => {
        this.mensajeTrivia = puntos > 0 ? `Correcto: +${puntos} puntos` : 'Incorrecto: +0 puntos';
        this.cargarRanking();
      },
    });
  }

  cargarRanking() {
    if (!this.evento) return;
    this.triviaService.ranking(this.evento.id).subscribe({ next: (r) => (this.ranking = r || []) });
    this.cd.detectChanges(); // fuerza actualización de la vista
  }

  abrirInforme() {
    if (!this.evento) return;
    this.eventoService.informeBlob(this.evento.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (e) => {
        this.tipoMensajeAsistencia = 'error';
        const msg = e?.error?.message || e?.error?.error || e?.message;
        this.mensajeAsistencia = msg
          ? String(msg)
          : `No se pudo abrir el informe (HTTP ${e?.status || '???'}).`;
      },
    });
  }

  apiFileUrl(path: string) {
    // backend guarda rutas tipo uploads/archivo.png, servido en /uploads/**
    // normalizamos para que siempre inicie con /uploads/
    const p = path.startsWith('/') ? path.slice(1) : path;
    return 'https://www.lexusinformatics.com/Sistema_Eventos/' + p;
  }

  onImgError(event: any) {
    event.target.src = '/uteq.png';
  }
}
