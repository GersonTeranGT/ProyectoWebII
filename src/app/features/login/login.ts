import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  anio: number = new Date().getFullYear();

  credenciales = {
    email: '',
    password: ''
  };

  mostrarPassword = false;
  cargando = false;
  submitted = false;
  errorMessage = '';
  mostrarMensajeLogout = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Verificar si ya hay sesión activa
    if (this.authService.sesionIniciada()) {
      this.redirigirSegunRol(); // <-- USAR MÉTODO DE REDIRECCIÓN
      return;
    }

    // Verificar si viene de un logout exitoso
    this.route.queryParams.subscribe(params => {
      this.mostrarMensajeLogout = params['logout'] === 'true';
      if (this.mostrarMensajeLogout) {
        Swal.fire({
          icon: 'info',
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ingresar() {
    this.submitted = true;
    this.errorMessage = '';

    // Validaciones
    if (!this.credenciales.email || !this.credenciales.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor ingresa tu correo y contraseña'
      });
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.credenciales.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email inválido',
        text: 'Por favor ingresa un correo electrónico válido'
      });
      return;
    }

    this.cargando = true;

    this.authService.login(this.credenciales.email, this.credenciales.password).subscribe({
      next: (success) => {
        this.cargando = false;

        if (success) {
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: `Has iniciado sesión como ${this.authService.usuarioActual()?.nombre}`,
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.redirigirSegunRol(); // <-- USAR MÉTODO DE REDIRECCIÓN
          });
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error en login:', error);

        let mensajeError = 'Error al conectar con el servidor';
        
        if (error.status === 401) {
          mensajeError = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          mensajeError = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (error.error?.error) {
          mensajeError = error.error.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: mensajeError
        });
      }
    });
  }

  // NUEVO MÉTODO PARA REDIRECCIÓN SEGÚN ROL
  private redirigirSegunRol() {
    if (this.authService.esAdmin()) {
      this.router.navigate(['/usuarios']); // Admin va a usuarios
    } else {
      this.router.navigate(['/test']); // Usuario va a test
    }
  }
}