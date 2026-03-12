import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ConfirmacionDto {
  confirmada: boolean;
  mensaje: string;
}

export interface QrDto {
  token: string;
  pngBase64: string;
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  asistir(eventoId: number) {
    return this.http.post<QrDto>(this.apiUrl + `/asistencias/eventos/${eventoId}/asistir`, {});
  }

  miQr(eventoId: number) {
    return this.http.get<QrDto>(this.apiUrl + `/asistencias/eventos/${eventoId}/mi-qr`);
  }

  confirmarEvento(eventoId: number) {
    return this.http.post<ConfirmacionDto>(this.apiUrl + `/asistencias/eventos/${eventoId}/confirmar`, {});
  }

  confirmarToken(token: string) {
    return this.http.post<ConfirmacionDto>(this.apiUrl + `/asistencias/confirmar-token`, { token });
  }
}
