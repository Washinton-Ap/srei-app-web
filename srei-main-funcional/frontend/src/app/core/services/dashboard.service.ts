import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface CardDto {
  titulo: string;
  valor: number;
}

export interface ChartDatasetDto {
  etiqueta: string;
  datos: number[];
}

export interface ChartDto {
  tipo: 'bar' | 'line' | 'pie';
  titulo: string;
  etiquetas: string[];
  datasets: ChartDatasetDto[];
}

export interface DashboardDto {
  rol: string;
  tarjetas: CardDto[];
  graficas: ChartDto[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  obtener() {
    return this.http.get<DashboardDto>(this.apiUrl + '/dashboard');
  }
}
