import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface UsuarioDto {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  habilitado: boolean;
  facultad?: string;
  carrera?: string;
  roles: string[];
}
export interface RolDto {
  id: number;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<UsuarioDto[]>(this.apiUrl + '/usuarios');
  }

  crear(payload: any) {
    return this.http.post<UsuarioDto>(this.apiUrl + '/usuarios', payload);
  }

  habilitar(id: number, valor: boolean) {
    return this.http.patch<UsuarioDto>(this.apiUrl + `/usuarios/${id}/habilitado?valor=${valor}`, {});
  }
  actualizarRol(id: number, rol: string) {
  return this.http.put(
    this.apiUrl + '/usuarios/' + id + '/roles',
    { rol }
  );
  
}
 listarRoles(){
     return this.http.get<RolDto[]>(
    this.apiUrl + '/usuarios/roles'
  );
   }
}
