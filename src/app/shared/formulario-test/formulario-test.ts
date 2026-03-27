import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { TestService } from '../../services/test-service';
import { AuthService } from '../../services/auth-service';
import { INTERPRETACIONES, OPCIONES_RESPUESTA, RespuestasTest } from '../../models/testResultado';

@Component({
  selector: 'app-formulario-test',
  imports: [FormsModule, RouterLink],
  templateUrl: './formulario-test.html',
  styleUrl: './formulario-test.css',
})
export class FormularioTest {
  private testService = inject(TestService);
  private authService = inject(AuthService);
  private router = inject(Router);

  opcionesRespuesta = OPCIONES_RESPUESTA;
  submitted = false;
  cargando = false;
  mostrarResultado = false;
  puntuacionTotal = 0;
  nivelResultado = '';
  mensajeResultado = '';

  respuestas: RespuestasTest = {
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

  onSubmit(testForm: NgForm) {
    this.submitted = true;

    if (testForm.valid) {
      this.cargando = true;

      // Verificar autenticación
      if (!this.authService.sesionIniciada()) {
        Swal.fire({
          icon: 'warning',
          title: 'Inicia sesión',
          text: 'Debes iniciar sesión para guardar tu test'
        }).then(() => {
          this.router.navigate(['/login']);
        });
        this.cargando = false;
        return;
      }

      // Calcular puntuación
      this.puntuacionTotal = Object.values(this.respuestas).reduce(
        (sum, valor) => sum + (valor || 0), 0
      );

      // Determinar nivel y mensaje
      const interpretacion = INTERPRETACIONES.find(i => this.puntuacionTotal <= i.max) || 
                            INTERPRETACIONES[INTERPRETACIONES.length - 1];
      this.nivelResultado = interpretacion.nivel;
      this.mensajeResultado = interpretacion.mensaje;
      this.mostrarResultado = true;

      // Preparar datos para enviar
      const usuarioActual = this.authService.usuarioActual();
      const testData = {
        usuarioId: usuarioActual.id,
        pregunta1: this.respuestas.pregunta1,
        pregunta2: this.respuestas.pregunta2,
        pregunta3: this.respuestas.pregunta3,
        pregunta4: this.respuestas.pregunta4,
        pregunta5: this.respuestas.pregunta5,
        pregunta6: this.respuestas.pregunta6,
        pregunta7: this.respuestas.pregunta7,
        pregunta8: this.respuestas.pregunta8,
        pregunta9: this.respuestas.pregunta9,
        pregunta10: this.respuestas.pregunta10
      };

      // Guardar en backend
      this.testService.guardarTest(testData).subscribe({
        next: (response) => {
          this.cargando = false;
          
          let nivelEspañol = 'mínima';
          if (response.nivelAnsiedad === 'Mínima') nivelEspañol = 'mínima';
          else if (response.nivelAnsiedad === 'Leve') nivelEspañol = 'leve';
          else if (response.nivelAnsiedad === 'Moderada') nivelEspañol = 'moderada';
          else if (response.nivelAnsiedad === 'Severa' || response.nivelAnsiedad === 'Extrema') nivelEspañol = 'severa';
          
          Swal.fire({
            icon: 'success',
            title: 'Test guardado',
            html: `
              <p><strong>Puntuación:</strong> ${response.puntuacionTotal} puntos</p>
              <p><strong>Nivel:</strong> ${nivelEspañol}</p>
            `,
            confirmButtonText: 'Ver historial'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/historial-test']);
              });
            }
          });
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error:', error);
          Swal.fire('Error', error.error?.error || 'No se pudo guardar el test', 'error');
        }
      });
    }
  }

  reiniciarTest() {
    this.respuestas = {
      pregunta1: null, pregunta2: null, pregunta3: null, pregunta4: null, pregunta5: null,
      pregunta6: null, pregunta7: null, pregunta8: null, pregunta9: null, pregunta10: null
    };
    this.submitted = false;
    this.mostrarResultado = false;
  }

}
