import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulario-test',
  imports: [FormsModule, RouterLink],
  templateUrl: './formulario-test.html',
  styleUrl: './formulario-test.css',
})
export class FormularioTest {
  opcionesRespuesta = [
    { valor: 0, texto: 'Nunca' },
    { valor: 1, texto: 'Varios días' },
    { valor: 2, texto: 'Más de la mitad de los días' },
    { valor: 3, texto: 'Casi todos los días' }
  ];

  respuestas = {
    pregunta1: null,
    pregunta2: null,
    pregunta3: null,
    pregunta4: null,
    pregunta5: null,
    pregunta6: null,
    pregunta7: null,
    pregunta8: null,
    pregunta9: null,
    pregunta10: null
  };

  cargando = false;
  submitted = false;
  mostrarResultado = false;
  puntuacionTotal = 0;
  interpretacionResultado = '';

  onSubmit() {
    this.submitted = true;

    // Validar que todas las preguntas estén respondidas
    if (!this.validarRespuestasCompletas()) {
      return;
    }

    this.cargando = true;

    // Simular cálculo
    setTimeout(() => {
      this.calcularPuntuacion();
      this.interpretarResultado();
      this.mostrarResultado = true;
      this.cargando = false;
    }, 1500);
  }

  validarRespuestasCompletas(): boolean {
    return Object.values(this.respuestas).every(respuesta => respuesta !== null);
  }

  calcularPuntuacion() {
    this.puntuacionTotal = Object.values(this.respuestas).reduce((total, valor) => total + (valor || 0), 0);
  }

  interpretarResultado() {
    if (this.puntuacionTotal <= 5) {
      this.interpretacionResultado = 'Ansiedad mínima. Mantén tus hábitos saludables.';
    } else if (this.puntuacionTotal <= 10) {
      this.interpretacionResultado = 'Ansiedad leve. Considera técnicas de relajación.';
    } else if (this.puntuacionTotal <= 15) {
      this.interpretacionResultado = 'Ansiedad moderada. Recomendamos consultar con un especialista.';
    } else {
      this.interpretacionResultado = 'Ansiedad severa. Te recomendamos buscar ayuda profesional.';
    }
  }

  reiniciarTest() {
    this.respuestas = {
      pregunta1: null,
      pregunta2: null,
      pregunta3: null,
      pregunta4: null,
      pregunta5: null,
      pregunta6: null,
      pregunta7: null,
      pregunta8: null,
      pregunta9: null,
      pregunta10: null
    };
    this.mostrarResultado = false;
    this.submitted = false;
  }
}
