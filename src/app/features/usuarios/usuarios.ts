import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsuarioServicios } from '../../services/usuario-servicios';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {

  private servicioUsuario = inject(UsuarioServicios);
  private router = inject(Router);
  
  listaUsuarios = signal<Usuario[]>([]);

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.servicioUsuario.getUsuarios().subscribe(Usuarios => {
      this.listaUsuarios.set(Usuarios);
    });
  }

  editarUsuario(user: Usuario) {
    // Navegar a register con el ID en la URL
    this.router.navigate(['/register', user.id]);
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Desea eliminar el registro?')) {
      this.servicioUsuario.deleteUsuario(id).subscribe(() => {
        this.listaUsuarios.set(this.listaUsuarios().filter(u => u.id !== id));
      });
    }
  }
}