import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { INTERPRETACIONES, RespuestasTest, TestResultado } from '../models/testResultado';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private http = inject(HttpClient);
  private API_URL = 'http://localhost:8080/api/tests';

  // Obtener historial de tests por usuario
  obtenerHistorial(id: number): Observable<TestResultado[]> {
    console.log('📡 Solicitando historial para usuario:', id);
    return this.http.get<any[]>(`${this.API_URL}/historial-test/${id}`).pipe(
      map(tests => {
      console.log('📦 Datos recibidos del backend:', tests);
      const mapeados = tests.map(test => this.mapearTest(test));
      console.log('✅ Datos mapeados:', mapeados);
      return mapeados;
    })
    );
  }

  
  // Obtener un test por ID
  obtenerTestPorId(id: number): Observable<TestResultado> {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(test => this.mapearTest(test))
    );
  }
  guardarTest(testData: any): Observable<any> {
  return this.http.post(`${this.API_URL}/guardar`, testData);
}
  // Mapear test del backend a nuestro modelo
  private mapearTest(test: any): TestResultado {
    // 1. MANEJO DE FECHA - CON VALIDACIONES
    let fechaFormateada = '--/--/----'; // Valor por defecto

    if (test.fechaRealizacion) {
      try {
        const fecha = new Date(test.fechaRealizacion);
        // Verificar que la fecha sea válida
        if (!isNaN(fecha.getTime())) {
          fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
        }
      } catch (error) {
        console.error('Error al formatear fecha:', error);
      }
    }

    // 2. MANEJO DE PUNTUACIÓN - VALOR POR DEFECTO
    const puntuacionTotal = test.puntuacionTotal || 0;

    // 3. MANEJO DE NIVEL - CON VALIDACIÓN
    let nivel = test.nivelAnsiedad?.toLowerCase();
    if (!nivel) {
      const interpretacion = INTERPRETACIONES.find(i => puntuacionTotal <= i.max) ||
        INTERPRETACIONES[INTERPRETACIONES.length - 1];
      nivel = interpretacion.nivel;
    }

    // 4. ASEGURAR QUE EL NIVEL SEA UNO DE LOS VALORES PERMITIDOS
    const nivelesPermitidos = ['mínima', 'leve', 'moderada', 'severa'];
    if (!nivelesPermitidos.includes(nivel)) {
      // Si el nivel no es válido, calcularlo basado en puntuación
      const interpretacion = INTERPRETACIONES.find(i => puntuacionTotal <= i.max) ||
        INTERPRETACIONES[INTERPRETACIONES.length - 1];
      nivel = interpretacion.nivel;
    }

    // 5. OBTENER RECOMENDACIÓN
    const recomendacion = this.obtenerRecomendacion(puntuacionTotal);

    // 6. RETORNAR OBJETO CON TODOS LOS CAMPOS VALIDADOS
    return {
      id: test.id,
      fecha: fechaFormateada, // Siempre string, nunca undefined
      puntuacion: puntuacionTotal,
      nivel: nivel as 'mínima' | 'leve' | 'moderada' | 'severa',
      recomendacion: recomendacion,
      respuestas: {
        pregunta1: test.pregunta1 ?? null, // Si es null o undefined, asigna null
        pregunta2: test.pregunta2 ?? null,
        pregunta3: test.pregunta3 ?? null,
        pregunta4: test.pregunta4 ?? null,
        pregunta5: test.pregunta5 ?? null,
        pregunta6: test.pregunta6 ?? null,
        pregunta7: test.pregunta7 ?? null,
        pregunta8: test.pregunta8 ?? null,
        pregunta9: test.pregunta9 ?? null,
        pregunta10: test.pregunta10 ?? null
      }
    };
  }

  // Obtener recomendación basada en puntuación
  private obtenerRecomendacion(puntuacion: number): string {
    // Asegurar que puntuación es un número válido
    const puntuacionValida = isNaN(puntuacion) ? 0 : puntuacion;

    for (const interp of INTERPRETACIONES) {
      if (puntuacionValida <= interp.max) {
        return interp.mensaje;
      }
    }
    return 'Busca ayuda profesional inmediatamente.';
  }
}
