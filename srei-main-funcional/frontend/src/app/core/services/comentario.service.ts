import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ComentarioDto {
  id: number;
  eventoId: number;
  autorCorreo: string;
  contenido: string;
  censurado: boolean;
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar(eventoId: number) {
    return this.http.get<ComentarioDto[]>(this.apiUrl + `/comentarios/eventos/${eventoId}`);
  }

  crear(eventoId: number, contenido: string) {
    return this.http.post<ComentarioDto>(this.apiUrl + `/comentarios/eventos/${eventoId}`, { contenido });
  }

  censurar(comentarioId: number, valor: boolean) {
    return this.http.patch<ComentarioDto>(this.apiUrl + `/comentarios/${comentarioId}/censurar?valor=${valor}`, {});
  }
}
