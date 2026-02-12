import { Component } from '@angular/core';
import { Hero } from "../../shared/hero/hero";
import { Servicios } from "../../shared/servicios/servicios";
import { Carrusel } from "../../shared/carrusel/carrusel";

@Component({
  selector: 'app-home',
  imports: [Hero, Servicios, Carrusel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
