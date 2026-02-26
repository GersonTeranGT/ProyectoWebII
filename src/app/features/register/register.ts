import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { UsuarioServicios } from '../../services/usuario-servicios';
import { Usuario } from '../../models/usuario';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  private servicioUsuario = inject(UsuarioServicios);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  editando = false;
  cargando = false;
  usuarioId: string | null = null;

  nuevoUsuario: Usuario = {
    nombre: '',
    email: '',
    telefono: '',
    username: '',
    password: '',
    rol: 'ROLE_USUARIO'
  };

  datosSesion = {
    password: '',
    confirmPassword: ''
  };

  constructor() {
    this.route.params.subscribe(params => {
    if (params['id']) {
      // Verificar que el usuario autenticado sea el mismo que intenta editar
      const usuarioActual = this.authService.usuarioActual();
      if (usuarioActual?.id.toString() !== params['id']) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No puedes editar otro usuario'
        });
        this.router.navigate(['/usuarios']);
        return;
      }
      this.cargarUsuario(params['id']);
    }
  });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  cargarUsuario(id: number) {
    this.cargando = true;
  this.usuarioId = id.toString();
  this.editando = true;
  
  this.servicioUsuario.getUsuarioById(id).subscribe({
    next: (usuario) => {
      this.nuevoUsuario = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        username: usuario.username,
        password: '********', // <-- PONER UN VALOR POR DEFECTO
        rol: usuario.rol
      };
      
      // Limpiar campos de contraseña (para nueva contraseña)
      this.datosSesion = {
        password: '',
        confirmPassword: ''
      };
      
      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al cargar usuario:', error);
      this.cargando = false;
      Swal.fire('Error', 'No se pudo cargar el usuario', 'error');
      this.router.navigate(['/usuarios']);
    }
  });
  }

  guardarUsuario() {
    this.cargando = true;

    // VALIDACIONES
    if (!this.nuevoUsuario.nombre || this.nuevoUsuario.nombre.trim() === '') {
      Swal.fire('Validación', 'El nombre es obligatorio', 'warning');
      this.cargando = false;
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!this.nuevoUsuario.email || !emailRegex.test(this.nuevoUsuario.email)) {
      Swal.fire('Validación', 'Ingrese un email válido', 'warning');
      this.cargando = false;
      return;
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (!this.nuevoUsuario.telefono || !telefonoRegex.test(this.nuevoUsuario.telefono)) {
      Swal.fire('Validación', 'El teléfono debe tener 10 dígitos', 'warning');
      this.cargando = false;
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!this.nuevoUsuario.username || !usernameRegex.test(this.nuevoUsuario.username)) {
      Swal.fire('Validación', 'El nombre de usuario debe tener entre 4 y 20 caracteres y solo puede contener letras, números y guión bajo', 'warning');
      this.cargando = false;
      return;
    }

    if (!this.editando) {
      // Registro nuevo - contraseña obligatoria
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!this.datosSesion.password || !passwordRegex.test(this.datosSesion.password)) {
        Swal.fire('Validación', 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial', 'warning');
        this.cargando = false;
        return;
      }

      if (this.datosSesion.password !== this.datosSesion.confirmPassword) {
        Swal.fire('Validación', 'Las contraseñas no coinciden', 'warning');
        this.cargando = false;
        return;
      }

      this.nuevoUsuario.password = this.datosSesion.password;
    } else {
      // Edición - contraseña opcional
      if (this.datosSesion.password && this.datosSesion.password.trim() !== '') {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(this.datosSesion.password)) {
          Swal.fire('Validación', 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial', 'warning');
          this.cargando = false;
          return;
        }

        if (this.datosSesion.password !== this.datosSesion.confirmPassword) {
          Swal.fire('Validación', 'Las contraseñas no coinciden', 'warning');
          this.cargando = false;
          return;
        }

        this.nuevoUsuario.password = this.datosSesion.password;
      } else {
        // Si no se ingresa nueva contraseña, no la enviamos
        this.nuevoUsuario.password = '';
      }
    }

    console.log('Enviando usuario:', this.nuevoUsuario);

    if (this.editando && this.usuarioId) {
      // Preparar datos para actualizar - solo enviar password si cambió
      const usuarioData: any = {
        nombre: this.nuevoUsuario.nombre,
        email: this.nuevoUsuario.email,
        telefono: this.nuevoUsuario.telefono,
        username: this.nuevoUsuario.username,
        rol: this.nuevoUsuario.rol
      };

      // Solo incluir password si se ingresó una nueva
      if (this.nuevoUsuario.password && this.nuevoUsuario.password.trim() !== '') {
        usuarioData.password = this.nuevoUsuario.password;
      }

      this.servicioUsuario.putUsuario(+this.usuarioId, usuarioData).subscribe({
        next: (response) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Usuario actualizado correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/usuarios']);
          });
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al actualizar:', error);
          Swal.fire('Error', error.error?.error || 'Error al actualizar usuario', 'error');
        }
      });
    } else {
      this.servicioUsuario.postUsuario(this.nuevoUsuario).subscribe({
        next: (response) => {
          this.cargando = false;
          Swal.fire({
            icon: 'success',
            title: '¡Registrado!',
            text: 'Usuario creado correctamente',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al crear:', error);
          Swal.fire('Error', error.error?.error || 'Error al crear usuario', 'error');
        }
      });
    }
  }
}