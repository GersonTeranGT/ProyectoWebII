import { Component, Input } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-carrusel',
  imports: [],
  templateUrl: './carrusel.html',
  styleUrl: './carrusel.css',
})
export class Carrusel {
  @Input() imagen1!: string;
  @Input() imagen2!: string;
  @Input() imagen3!: string;
  @Input() imagen4!: string;
  @Input() alt1: string = 'Slide 1';
  @Input() alt2: string = 'Slide 2';
  @Input() alt3: string = 'Slide 3';
  @Input() alt4: string = 'Slide 4';

  @Input() altura: string = 'h-56 md:h-96';
  @Input() id: string = 'default-carousel';

  ngAfterViewInit() {
    //inicializamos Flowbite despues de que el dom este listo
    if (typeof initFlowbite === 'function') {
      initFlowbite();
    }
  }
}
