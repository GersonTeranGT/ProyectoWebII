import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  //inyeccion
  public authService = inject(AuthService)
  @Input() titulo!: string;
  @Input() parrafo!: string;
  @Input() imagenFondo!: string;
  @Input() altura: string = 'min-h-[90vh]';
  
  // Botones - Opcionales
  @Input() mostrarBoton1: boolean = false;
  @Input() textoBoton1: string = 'Comienza ahora';
  @Input() rutaBoton1: string = '/';
  @Input() colorBoton1: string = 'bg-emerald-600 hover:bg-emerald-700 text-emerald-50';
  
  @Input() mostrarBoton2: boolean = false;
  @Input() textoBoton2: string = 'Iniciar sesión';
  @Input() rutaBoton2: string = '/login';
  @Input() colorBoton2: string = 'bg-emerald-50 hover:bg-emerald-100 text-green-700';
}
