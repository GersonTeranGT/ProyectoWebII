import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina404',
  imports: [],
  templateUrl: './pagina404.html',
  styleUrl: './pagina404.css',
})
export class Pagina404 {
  urlIntentada: string = '';

  constructor(private location: Location, private router: Router) {
    this.urlIntentada = this.router.url;  //captura la URL que causo el 404
  }

  regresar(): void {
    this.location.back();
  }
}
