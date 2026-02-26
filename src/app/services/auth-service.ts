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

  // Usamos señales que se actualizarán automáticamente
  sesionIniciada = signal<boolean>(this.getSesionInicial());
  usuarioActual = signal<any>(this.getUsuarioInicial());
  rolActual = signal<string | null>(this.getRolInicial());

  private getSesionInicial(): boolean {
    return localStorage.getItem('sesion') === 'true';
  }

  private getUsuarioInicial(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private getRolInicial(): string | null {
    return localStorage.getItem('rol');
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.API_URL, { email, password }).pipe(
      tap(response => {
        if (response && response.id) {
          // Guardar en localStorage
          localStorage.setItem('sesion', 'true');
          localStorage.setItem('user', JSON.stringify(response));
          localStorage.setItem('rol', response.rol);
          
          // Actualizar señales
          this.sesionIniciada.set(true);
          this.usuarioActual.set(response);
          this.rolActual.set(response.rol);
          
          console.log('Rol actualizado a:', response.rol); // Debug
        }
      }),
      map(response => !!(response && response.id))
    );
  }

  logout() {
    localStorage.removeItem('sesion');
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
}