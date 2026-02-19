import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UsuarioServicios } from '../../services/usuario-servicios';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private servicioUsuario = inject(UsuarioServicios);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  editando = false;
  cargando = false;
  usuarioId: string | null = null;

  nuevoUsuario: Usuario = {
    name: '',
    email: '',
    phone: '',
    password: '',
    rol: 'USER'
  };

  datosSesion = {
    username: '',
    password: '',
    confirmPassword: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.cargarUsuario(params['id']);
      }
    });
  }

  cargarUsuario(id: string) {
    this.cargando = true;
    this.usuarioId = id;
    
    this.servicioUsuario.getUsuarioById(id).subscribe(usuario => {
      this.nuevoUsuario = { 
        name: usuario.name, 
        email: usuario.email, 
        phone: usuario.phone,
        password: usuario.password,
        rol: usuario.rol
      };
      
      this.editando = true;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  guardarUsuario() {
    this.cargando = true;

    // Validar que las contraseñas coincidan
    if (this.datosSesion.password !== this.datosSesion.confirmPassword) {
      alert('Las contraseñas no coinciden');
      this.cargando = false;
      return;
    }

    // Asignar la contraseña de datosSesion al nuevoUsuario
    this.nuevoUsuario.password = this.datosSesion.password;

    if (this.editando && this.usuarioId) {
      this.servicioUsuario.putUsuario(this.usuarioId, {
        name: this.nuevoUsuario.name,
        email: this.nuevoUsuario.email,
        phone: this.nuevoUsuario.phone,
        password: this.nuevoUsuario.password,
        rol: this.nuevoUsuario.rol
      }).subscribe({
        next: () => {
          this.cargando = false;
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.cargando = false;
          alert('Error al actualizar usuario');
        }
      });
    } else {
      this.servicioUsuario.postUsuario({
        name: this.nuevoUsuario.name,
        email: this.nuevoUsuario.email,
        phone: this.nuevoUsuario.phone,
        password: this.nuevoUsuario.password,
        rol: 'USER'
      }).subscribe({
        next: () => {
          this.cargando = false;
          this.router.navigate(['/usuarios']);
        },
        error: () => {
          this.cargando = false;
          alert('Error al crear usuario');
        }
      });
    }
  }
}