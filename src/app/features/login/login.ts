import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  credenciales = {
    username: '',
    password: ''
  };

  mostrarPassword = false;
  recordarUsuario = false;
  cargando = false;
  submitted = false;
  errorMessage = '';
  mostrarMensajeLogout = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Verificar si viene de un logout exitoso
    this.route.queryParams.subscribe(params => {
      this.mostrarMensajeLogout = params['logout'] === 'true';
    });

    // Cargar usuario guardado si existe
    const usuarioGuardado = localStorage.getItem('usuarioRecordado');
    if (usuarioGuardado) {
      this.credenciales.username = usuarioGuardado;
      this.recordarUsuario = true;
    }
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    // Validaciones básicas
    if (!this.credenciales.username || !this.credenciales.password) {
      return;
    }

    this.cargando = true;

    // SIMULACIÓN de llamada a API
    setTimeout(() => {
      // Aquí iría tu lógica real de autenticación
      if (this.credenciales.username === 'admin' && this.credenciales.password === '123456') {

        // Guardar usuario si seleccionó "Recordarme"
        if (this.recordarUsuario) {
          localStorage.setItem('usuarioRecordado', this.credenciales.username);
        } else {
          localStorage.removeItem('usuarioRecordado');
        }

        // Simular token de autenticación
        localStorage.setItem('token', 'fake-jwt-token');
        localStorage.setItem('usuario', JSON.stringify({
          username: this.credenciales.username,
          nombre: 'Usuario Admin'
        }));

        // Redirigir al inicio
        this.router.navigate(['/inicio']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    }, 1500);
  }
}
