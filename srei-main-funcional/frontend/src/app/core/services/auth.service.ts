import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(this.apiUrl + '/auth/login', data);
  }

  register(data: { nombres: string; apellidos: string; correo: string; contrasena: string }) {
    return this.http.post<LoginResponse>(this.apiUrl + '/auth/register', data);
  }

  saveSession(resp: LoginResponse) {
    localStorage.setItem('token', resp.token);
    localStorage.setItem('roles', JSON.stringify(resp.roles || []));
    localStorage.setItem(
      'usuario',
      JSON.stringify({
        correo: resp.correo,
        nombres: resp.nombres,
        apellidos: resp.apellidos,
      }),
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('usuario');
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }
  getUsuario() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  getRoles() {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }
}
