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
    phone: ''
  };

  // Objeto para datos de inicio de sesión (SOLO VALIDACIÓN, NO SE GUARDA EN BD)
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
        phone: usuario.phone
      };
      
      this.editando = true;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  guardarUsuario() {
    this.cargando = true;

    if (this.editando && this.usuarioId) {
      this.servicioUsuario.putUsuario(this.usuarioId, {
        name: this.nuevoUsuario.name,
        email: this.nuevoUsuario.email,
        phone: this.nuevoUsuario.phone
      }).subscribe(() => {
        this.cargando = false;
        this.router.navigate(['/usuarios']);
      });
    } else {
      this.servicioUsuario.postUsuario({
        name: this.nuevoUsuario.name,
        email: this.nuevoUsuario.email,
        phone: this.nuevoUsuario.phone
      }).subscribe(() => {
        this.cargando = false;
        this.router.navigate(['/usuarios']);
      });
    }
  }
}