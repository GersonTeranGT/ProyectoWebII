import { inject, Injectable, signal } from '@angular/core';
import { UsuarioServicios } from './usuario-servicios';
import { map, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/auth/login';

  sesionIniciada = signal<boolean>(this.getSesionInicial());
  usuarioActual = signal<any>(this.getUsuarioInicial());
  rolActual = signal<string | null>(this.getRolInicial());

  private getSesionInicial(): boolean {
    return !!localStorage.getItem('token');
  }

  private getUsuarioInicial(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getRolInicial(): string | null {
    return localStorage.getItem('rol');
  }

  // En auth.service.ts

debugAuthState() {
    console.log('=== DEBUG AUTH STATE ===');
    console.log('Token:', this.getToken());
    console.log('Usuario actual signal:', this.usuarioActual());
    console.log('Usuario desde localStorage:', localStorage.getItem('user'));
    console.log('Rol actual:', this.rolActual());
    console.log('Sesión iniciada:', this.sesionIniciada());
    console.log('========================');
}

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          // Guardar token y datos del usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('rol', response.rol);
          
          // Actualizar señales
          this.sesionIniciada.set(true);
          this.usuarioActual.set(response);
          this.rolActual.set(response.rol);
          
          console.log('Login exitoso, token guardado');
        }
      }),
      map(response => !!(response && response.token))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.sesionIniciada.set(false);
    this.usuarioActual.set(null);
    this.rolActual.set(null);
  }

  esAdmin(): boolean {
    return this.rolActual() === 'ROLE_ADMIN';
  }

  estaAutenticado(): boolean {
    return this.sesionIniciada();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}