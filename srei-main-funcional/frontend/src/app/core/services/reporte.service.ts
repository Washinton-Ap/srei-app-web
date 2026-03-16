import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ReporteEventoDto {
  eventoId: number;
  titulo: string;
  registrados: number;
  confirmados: number;
  comentariosVisibles: number;
  impacto: number;
  [key: string]: any;
}

export interface SerieDto {
  titulo: string;
  etiquetas: string[];
  valores: number[];
}

export interface ReporteResumenDto {
  totalEventos: number;
  registrados: number;
  confirmados: number;
  comentarios: number;
  series: SerieDto[];
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ReporteService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  decano() {
    return this.http.get<ReporteEventoDto[]>(this.apiUrl + '/reportes/decano');
  }

  coordinador() {
    return this.http.get<ReporteEventoDto[]>(this.apiUrl + '/reportes/coordinador');
  }

  resumenDecano() {
    return this.http.get<ReporteResumenDto>(this.apiUrl + '/reportes/decano/resumen');
  }

  resumenCoordinador() {
    return this.http.get<ReporteResumenDto>(this.apiUrl + '/reportes/coordinador/resumen');
  }
  exportarPDF(tipo: string) {
    return this.http.get(this.apiUrl + '/reportes/' + tipo + '/pdf', { responseType: 'blob' });
  }

  exportarExcel(tipo: string) {
    return this.http.get(this.apiUrl + '/reportes/' + tipo + '/excel', { responseType: 'blob' });
  }

  obtenerReporte(tipo: string) {
  return this.http.get<any[]>(
    this.apiUrl + '/reportes/' + tipo
  );
}
}
