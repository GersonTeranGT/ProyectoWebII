import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsuarioServicios } from '../../services/usuario-servicios';
import { Usuario } from '../../models/usuario';
import { Hero } from "../../shared/hero/hero";
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [RouterLink, Hero],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  private usuarioServicios = inject(UsuarioServicios);
  public authService = inject(AuthService);
  private router = inject(Router);
  
  listaUsuarios = signal<Usuario[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarUsuarios();
    this.authService.debugAuthState();
  }

  cargarUsuarios(): void {
    this.cargando.set(true);
    
    if (this.authService.esAdmin()) {
      // ADMIN: carga todos los usuarios
      this.usuarioServicios.getUsuarios().subscribe({
        next: (data) => {
          this.listaUsuarios.set(data);
          this.cargando.set(false);
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.cargando.set(false);
          Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
      });
    } else {
      // USUARIO NORMAL: carga solo su propio registro
      const usuarioActual = this.authService.usuarioActual();
      if (usuarioActual?.id) {
        this.usuarioServicios.getUsuarioById(usuarioActual.id).subscribe({
          next: (data) => {
            this.listaUsuarios.set([data]); // Lo muestra como array de 1 elemento
            this.cargando.set(false);
          },
          error: (error) => {
            console.error('Error al cargar usuario:', error);
            this.cargando.set(false);
            Swal.fire('Error', 'No se pudo cargar tu información', 'error');
          }
        });
      }
    }
  }

  editarUsuario(usuario: Usuario) {
    console.log('=== INICIO EDITAR USUARIO ===');
    console.log('Usuario a editar:', usuario);
    console.log('ID usuario a editar:', usuario.id, 'Tipo:', typeof usuario.id);
    
    const usuarioActual = this.authService.usuarioActual();
    console.log('Usuario actual desde authService:', usuarioActual);
    console.log('ID usuario actual:', usuarioActual?.id, 'Tipo:', typeof usuarioActual?.id);
    
    const rolActual = this.authService.rolActual();
    console.log('Rol actual:', rolActual);
    
    // Verificar que sea usuario normal
    if (rolActual === 'ROLE_USUARIO') {
        // Comparación segura convirtiendo a string para evitar problemas de tipo
        const idUsuarioEditar = usuario.id?.toString();
        const idUsuarioActual = usuarioActual?.id?.toString();
        
        console.log('Comparando IDs:', idUsuarioEditar, '===', idUsuarioActual);
        
        if (idUsuarioEditar === idUsuarioActual) {
            console.log('✅ Usuario editando su propio perfil - permitir');
            this.router.navigate(['/register', usuario.id]);
        } else {
            console.error('❌ Intento de editar otro perfil:', {
                intentaEditar: idUsuarioEditar,
                usuarioActual: idUsuarioActual
            });
            Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                text: 'Solo puedes editar tu propio perfil'
            });
        }
    } else if (rolActual === 'ROLE_ADMIN') {
        console.log('⚠️ Administrador intentando editar usuario');
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Los administradores no pueden editar usuarios'
        });
    } else {
        console.error('❌ Rol no reconocido:', rolActual);
        Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'No tienes permisos para realizar esta acción'
        });
    }
    
    console.log('=== FIN EDITAR USUARIO ===');
}

  eliminarUsuario(id: number): void {
    // Solo admin puede eliminar
    if (!this.authService.esAdmin()) {
      Swal.fire('Acceso denegado', 'No tienes permisos para eliminar usuarios', 'error');
      return;
    }

    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede revertir',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioServicios.deleteUsuario(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
            this.cargarUsuarios(); // Recargar la lista
          },
          error: (error) => {
            console.error('Error al eliminar:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }
}