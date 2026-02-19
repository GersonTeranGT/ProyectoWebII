import { inject, Injectable, signal } from '@angular/core';
import { UsuarioServicios } from './usuario-servicios';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private servicioUsuario = inject(UsuarioServicios);

  sesionIniciada = signal<boolean>(localStorage.getItem('sesion') === 'true');
  rolActual = signal<'ADMIN' | 'USER' | null>(localStorage.getItem('rol') as 'ADMIN' | 'USER' | null);

  login(email: string, password: string): Observable<boolean> {
    return this.servicioUsuario.getUsuarios().pipe(
      map(usuarios => {
        const usuarioCoincide = usuarios.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );
        
        if (usuarioCoincide) {
          localStorage.setItem('sesion', 'true');
          localStorage.setItem('user', JSON.stringify(usuarioCoincide));
          localStorage.setItem('rol', usuarioCoincide.rol);
          
          this.sesionIniciada.set(true);
          this.rolActual.set(usuarioCoincide.rol);
          return true;
        }
        return false;
      })
    );
  }

  logout() {
    localStorage.removeItem('sesion');
    localStorage.removeItem('user');
    localStorage.removeItem('rol');
    this.sesionIniciada.set(false);
    this.rolActual.set(null);
  }

  esAdmin(): boolean {
    return this.rolActual() === 'ADMIN';
  }
}