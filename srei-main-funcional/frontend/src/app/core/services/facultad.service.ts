import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface FacultadDto {
  idfacultad: number;
  nombre: string;
}

export interface CarreraDto {
  idcarrera: number;
  nombre: string;
  idfacultad: number;
}

@Injectable({ providedIn: 'root' })
export class FacultadService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

facultades() {
  return this.http.get<FacultadDto[]>(this.apiUrl + '/facultades');
}

carrerasPorFacultad(facultadId: number) {
  console.log("service: "+facultadId);
  return this.http.get<CarreraDto[]>(this.apiUrl + '/carreras/'+facultadId);
}

}