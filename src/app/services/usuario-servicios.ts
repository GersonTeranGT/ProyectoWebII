import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicios {

  private http = inject(HttpClient);
  private API_URL = 'https://app-crud-c78e1-default-rtdb.firebaseio.com/'

  //Metodo Get para firebase
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<{ [key: string]: Usuario }>(`${this.API_URL}/usuarios.json`).pipe(
      map(respuesta => {
        if (!respuesta) {
          return [];
        } else {
          return Object.keys(respuesta).map(id => {
            const usuarioConId = { ...respuesta[id], id: id };
            return usuarioConId
          })
        }
      })
    )
  }

  //Metodo post
  postUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.API_URL}/usuarios.json`, usuario);
  }

  //Metodo buscarPorId
  getUsuarioById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/usuarios/${id}.json`)
  }

  //Metodo put
  putUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/usuarios/${id}.json`, usuario)
  }

  //Metodo delete
  deleteUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/usuarios/${id}.json`)
  }
}