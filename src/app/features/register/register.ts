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
  private cdr = inject(ChangeDetectorRef); // 👈 IMPORTANTE: Forzar detección de cambios

  editando = false;
  cargando = false;
  usuarioId: string | null = null;

  nuevoUsuario: Usuario = {
    name: '',
    email: '',
    phone: ''
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
      // Asignar los datos
      this.nuevoUsuario = { 
        name: usuario.name, 
        email: usuario.email, 
        phone: usuario.phone
      };
      
      this.editando = true;
      this.cargando = false;
      
      // 👈 FORZAR la detección de cambios para que los inputs se actualicen INMEDIATAMENTE
      this.cdr.detectChanges();
    });
  }

  guardarUsuario() {
    this.cargando = true;

    if (this.editando && this.usuarioId) {
      // Enviamos SOLO name, email, phone (SIN el id)
      this.servicioUsuario.putUsuario(this.usuarioId, {
        name: this.nuevoUsuario.name,
        email: this.nuevoUsuario.email,
        phone: this.nuevoUsuario.phone
      }).subscribe(() => {
        this.cargando = false;
        this.router.navigate(['/usuarios']);
      });
    } else {
      // Crear nuevo usuario
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