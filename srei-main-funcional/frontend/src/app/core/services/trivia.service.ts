import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface PreguntaDto {
  id: number;
  enunciado: string;
  opciones: string[];
}

export interface RankingItemDto {
  correo: string;
  nombres: string;
  apellidos: string;
  puntaje: number;
}

@Injectable({ providedIn: 'root' })
export class TriviaService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  preguntas(eventoId: number) {
    return this.http.get<PreguntaDto[]>(this.apiUrl + `/trivia/eventos/${eventoId}`);
  }

  crearPregunta(eventoId: number, payload: { enunciado: string; opciones: string[]; indiceCorrecto: number }) {
    return this.http.post<PreguntaDto>(this.apiUrl + `/trivia/eventos/${eventoId}/preguntas`, payload);
  }

  responder(eventoId: number, preguntaId: number, indiceSeleccionado: number) {
    return this.http.post<number>(
      this.apiUrl + `/trivia/eventos/${eventoId}/preguntas/${preguntaId}/responder`,
      { indiceSeleccionado }
    );
  }

  ranking(eventoId: number) {
    return this.http.get<RankingItemDto[]>(this.apiUrl + `/trivia/eventos/${eventoId}/ranking`);
  }
}
