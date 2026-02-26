import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioServicios {

  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/usuarios';

  //metodo get
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL)
  }
  //Metodo Get para firebase
  // getUsuarios(): Observable<Usuario[]> {
  //   return this.http.get<{ [key: string]: Usuario }>(`${this.API_URL}/usuarios.json`).pipe(
  //     map(respuesta => {
  //       if (!respuesta) {
  //         return [];
  //       } else {
  //         return Object.keys(respuesta).map(id => {
  //           const usuarioConId = { ...respuesta[id], id: id };
  //           return usuarioConId
  //         })
  //       }
  //     })
  //   )
  // }

  //Metodo post
  postUsuario(usuario: Usuario): Observable<Usuario> {
    console.log('URL:', `${this.API_URL}/register`);
  console.log('Datos a enviar:', usuario);
    return this.http.post<Usuario>(`${this.API_URL}/register`, usuario);
  }

  //Metodo buscarPorId
  getUsuarioById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/${id}`)
  }

  //Metodo put
  putUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}`, usuario)
  }

  //Metodo delete
  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }
}