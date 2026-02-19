import { Component, inject } from '@angular/core';
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
export class Login {

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
    // Verificar si viene de un logout exitoso
    this.route.queryParams.subscribe(params => {
      this.mostrarMensajeLogout = params['logout'] === 'true';
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ingresar() {
  this.submitted = true;
  this.errorMessage = '';

  if (!this.credenciales.email || !this.credenciales.password) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor ingresa tu correo y contraseña'
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
          title: 'Bienvenido',
          text: 'Has iniciado sesión correctamente'
        }).then(() => {
          // Cambiar de '/inicio' a '' (ruta raíz)
          this.router.navigate(['']);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Usuario o contraseña incorrectos'
        });
      }
    },
    error: (error) => {
      this.cargando = false;
      console.error('Error en login:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Intenta nuevamente.'
      });
    }
  });
}

}