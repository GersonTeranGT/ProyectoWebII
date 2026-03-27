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

  //metodo modificado
  obtenerHistorial(id: number): Observable<{ tests: TestResultado[]; resumen: any }> {
    console.log('📡 Solicitando historial para usuario:', id);
    return this.http.get<any>(`${this.API_URL}/historial-test/${id}`).pipe(
      map(response => {
        console.log('Datos recibidos del backend:', response);
        
        // 1. Procesar la lista de tests
        const testsMapeados = response.tests.map((test: any) => this.mapearTest(test));
        console.log('Tests mapeados:', testsMapeados);
        
        // 2. Procesar el resumen del procedimiento
        const resumen = {
          totalTests: response.resumen?.totalTests || 0,
          promedioPuntuacion: response.resumen?.promedioPuntuacion || 0,
          ultimoNivel: response.resumen?.ultimoNivel || 'Sin tests',
          mensaje: response.resumen?.mensaje || this.generarMensajePorDefecto(response.resumen?.totalTests)
        };
        
        console.log('Resumen del procedimiento:', resumen);
        
        // 3. Retornar ambos
        return {
          tests: testsMapeados,
          resumen: resumen
        };
      })
    );
  }

  //para obtener solo el resumen
  obtenerResumen(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/resumen/${id}`).pipe(
      map(resumen => ({
        totalTests: resumen.totalTests || 0,
        promedioPuntuacion: resumen.promedioPuntuacion || 0,
        ultimoNivel: resumen.ultimoNivel || 'Sin tests',
        mensaje: resumen.mensaje || this.generarMensajePorDefecto(resumen.totalTests)
      }))
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

  //generamos un mensaje por defecto si no viene del backend
  private generarMensajePorDefecto(totalTests: number): string {
    if (totalTests === 0) {
      return "Aún no has realizado ningún test. ¡Realiza tu primera evaluación para conocer tu nivel de ansiedad!";
    }
    return "Continúa monitoreando tu salud mental. Cada test te ayuda a conocer mejor tu evolución.";
  }

  // Mapear test del backend a nuestro modelo
  private mapearTest(test: any): TestResultado {
    // 1. MANEJO DE FECHA - CON VALIDACIONES
    let fechaFormateada = '--/--/----';

    if (test.fechaRealizacion) {
      try {
        const fecha = new Date(test.fechaRealizacion);
        if (!isNaN(fecha.getTime())) {
          fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
        }
      } catch (error) {
        console.error('Error al formatear fecha:', error);
      }
    }

    // 2. MANEJO DE PUNTUACIÓN
    const puntuacionTotal = test.puntuacionTotal || 0;

    // 3. MANEJO DE NIVEL
    let nivel = test.nivelAnsiedad?.toLowerCase();
    if (!nivel) {
      const interpretacion = INTERPRETACIONES.find(i => puntuacionTotal <= i.max) ||
        INTERPRETACIONES[INTERPRETACIONES.length - 1];
      nivel = interpretacion.nivel;
    }

    // 4. VALIDAR NIVEL
    const nivelesPermitidos = ['mínima', 'leve', 'moderada', 'severa'];
    if (!nivelesPermitidos.includes(nivel)) {
      const interpretacion = INTERPRETACIONES.find(i => puntuacionTotal <= i.max) ||
        INTERPRETACIONES[INTERPRETACIONES.length - 1];
      nivel = interpretacion.nivel;
    }

    // 5. OBTENER RECOMENDACIÓN
    const recomendacion = this.obtenerRecomendacion(puntuacionTotal);

    // 6. RETORNAR OBJETO
    return {
      id: test.id,
      fecha: fechaFormateada,
      puntuacion: puntuacionTotal,
      nivel: nivel as 'mínima' | 'leve' | 'moderada' | 'severa',
      recomendacion: recomendacion,
      respuestas: {
        pregunta1: test.pregunta1 ?? null,
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
    const puntuacionValida = isNaN(puntuacion) ? 0 : puntuacion;
    for (const interp of INTERPRETACIONES) {
      if (puntuacionValida <= interp.max) {
        return interp.mensaje;
      }
    }
    return 'Busca ayuda profesional inmediatamente.';
  }
}
