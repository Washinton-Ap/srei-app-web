import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface EventoDto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  ambito: 'FACULTAD' | 'CARRERA';
  hora: string;
  facultad?: string;
  carrera?: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observaciones?: string;
  docenteCorreo?: string;
  rutaImagen?: string;
  rutaInformePdf?: string;
}

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  publicos() {
    return this.http.get<EventoDto[]>(this.apiUrl + '/eventos/publicos');
  }

  detalle(id: number) {
    return this.http.get<EventoDto>(this.apiUrl + '/eventos/' + id);
  }

  pendientesDecano() {
    return this.http.get<EventoDto[]>(this.apiUrl + '/eventos/pendientes/decano');
  }

  pendientesCoordinador() {
    return this.http.get<EventoDto[]>(this.apiUrl + '/eventos/pendientes/coordinador');
  }

  decidir(id: number, estado: 'APROBADO' | 'RECHAZADO', observaciones: string) {
    return this.http.post<EventoDto>(this.apiUrl + `/eventos/${id}/decision`, {
      estado,
      observaciones,
    });
  }

  proponer(form: {
    titulo: string;
    descripcion: string;
    fecha: string;
    lugar: string;
    ambito: 'FACULTAD' | 'CARRERA';
    hora: string;
    facultad?: string;
    carrera?: string;
    imagen?: File | null;
    informePdf?: File | null;
  }) {
    const fd = new FormData();
    fd.append('titulo', form.titulo);
    fd.append('descripcion', form.descripcion);
    fd.append('fecha', form.fecha);
    fd.append('lugar', form.lugar);
    fd.append('ambito', form.ambito);
     fd.append('hora', form.hora);
    if (form.facultad) fd.append('facultad', form.facultad);
    if (form.carrera) fd.append('carrera', form.carrera);
    if (form.imagen) fd.append('imagen', form.imagen);
    if (form.informePdf) fd.append('informePdf', form.informePdf);

    return this.http.post<EventoDto>(this.apiUrl + '/eventos', fd);
  }

  misEventos(estado?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO') {
    const q = estado ? `?estado=${estado}` : '';
    return this.http.get<EventoDto[]>(this.apiUrl + '/eventos/mios' + q);
  }

  reenviar(
    id: number,
    form: {
      titulo: string;
      descripcion: string;
      fecha: string;
      lugar: string;
      ambito: 'FACULTAD' | 'CARRERA';
      hora:string;
      facultad?: string;
      carrera?: string;
      imagen?: File | null;
      informePdf?: File | null;
    },
  ) {
    const fd = new FormData();
    fd.append('titulo', form.titulo);
    fd.append('descripcion', form.descripcion);
    fd.append('fecha', form.fecha);
    fd.append('lugar', form.lugar);
    fd.append('ambito', form.ambito);
    if (form.facultad) fd.append('facultad', form.facultad);
    if (form.carrera) fd.append('carrera', form.carrera);
    if (form.imagen) fd.append('imagen', form.imagen);
    if (form.informePdf) fd.append('informePdf', form.informePdf);
    return this.http.put<EventoDto>(this.apiUrl + `/eventos/${id}/reenviar`, fd);
  }

  informeBlob(id: number) {
    return this.http.get(this.apiUrl + `/eventos/${id}/informe`, { responseType: 'blob' });
  }

  generarImagenIA(prompt: string) {
    return this.http.post(this.apiUrl+'/ia/generar-imagen', { prompt });
  }
}
