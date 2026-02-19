import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

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
      return;
    }

    this.cargando = true;

    this.authService.login(this.credenciales.email, this.credenciales.password).subscribe({
      next: (success) => {
        this.cargando = false;
        
        if (success) {
          // Cambiar de '/inicio' a '' (ruta raíz)
          this.router.navigate(['']);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      },
      error: (error) => {
        this.cargando = false;
        this.errorMessage = 'Error al conectar con el servidor';
        console.error('Error en login:', error);
      }
    });
  }
}