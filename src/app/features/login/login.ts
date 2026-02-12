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

  anio: number = new Date().getFullYear();

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
    //verificamos si viene de un logout exitoso
    // this.route.queryParams.subscribe(params => {
    //   this.mostrarMensajeLogout = params['logout'] === 'true';
    // });

  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ingresar() {
    this.submitted = true;
    this.errorMessage = '';

    //validaciones basicas
    if (!this.credenciales.username || !this.credenciales.password) {
      return;
    }

    this.cargando = true;

    //SIMULACION de llamada a la API
    setTimeout(() => {
      //aqui ira tu lógica real de autenticacion
      if (this.credenciales.username === 'admin' && this.credenciales.password === '123456') {


        //redirigir al inicio
        this.router.navigate(['']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        this.cargando = false;
      }
    }, 1500);
  }
}
