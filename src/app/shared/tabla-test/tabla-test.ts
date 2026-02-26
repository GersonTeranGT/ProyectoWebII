import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TestResultado } from '../../models/testResultado';
import Swal from 'sweetalert2';
import { TestService } from '../../services/test-service';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-tabla-test',
  imports: [FormsModule, RouterLink],
  templateUrl: './tabla-test.html',
  styleUrl: './tabla-test.css',
})
export class TablaTest implements OnInit {
  private testService = inject(TestService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute)

  ngOnInit() {
    this.cargarHistorial();
    this.route.params.subscribe(() => {
      // Cada vez que los parámetros cambien, recargar
      this.cargarHistorial();
    });
  }

  // Datos
  historialCompleto: TestResultado[] = [];
  historialFiltrado: TestResultado[] = [];
  cargando = true;

  // Estadísticas
  totalTests = 0;
  ultimoTestFecha = '--/--/----';
  promedioPuntuacion = '0';

  // Filtros
  filtroBusqueda = '';
  filtroNivel = '';

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 5;
  totalPaginas = 1;
  paginas: number[] = [];

  // Math para usar en template
  Math = Math;

  // Método para calcular el nivel según la puntuación
  calcularNivelPorPuntuacion(puntuacion: number): "mínima" | "leve" | "moderada" | "severa" {
    if (puntuacion <= 5) return 'mínima';
    if (puntuacion <= 10) return 'leve';
    if (puntuacion <= 15) return 'moderada';
    return 'severa';
  }

  cargarHistorial() {
    const usuarioActual = this.authService.usuarioActual();
    console.log('👤 Usuario actual:', usuarioActual);

    if (!usuarioActual?.id) {
      console.error('❌ No hay usuario autenticado');
      return;
    }

    this.cargando = true;

    this.testService.obtenerHistorial(usuarioActual.id).subscribe({
      next: (tests) => {
        console.log('📊 Tests recibidos en componente:', tests);

        const testsCorregidos: TestResultado[] = tests.map(test => ({
          ...test,
          nivel: this.calcularNivelPorPuntuacion(test.puntuacion)
        }));

        this.historialCompleto = testsCorregidos;
        this.historialFiltrado = [...testsCorregidos];

        console.log('📋 Tests corregidos:', this.historialCompleto);

        this.calcularEstadisticas();
        this.actualizarPaginacion();
        this.cargando = false;
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas() {
    this.totalTests = this.historialCompleto.length;

    if (this.totalTests > 0) {
      // Ordenar por fecha para obtener el más reciente
      const testsOrdenados = [...this.historialCompleto].sort((a, b) => {
        // Asegurar que ambas fechas existen
        if (!a.fecha || !b.fecha) return 0;
        return this.convertirFecha(b.fecha).getTime() - this.convertirFecha(a.fecha).getTime();
      });

      // Obtener la fecha del primer elemento si existe
      if (testsOrdenados.length > 0 && testsOrdenados[0].fecha) {
        this.ultimoTestFecha = testsOrdenados[0].fecha;
      }

      const suma = this.historialCompleto.reduce((acc, test) => acc + test.puntuacion, 0);
      const promedio = suma / this.totalTests;
      this.promedioPuntuacion = promedio.toFixed(1);
    }
  }

  private convertirFecha(fechaStr: string): Date {
    if (!fechaStr || fechaStr === '--/--/----') {
      return new Date(0);
    }

    try {
      const [dia, mes, año] = fechaStr.split('/').map(Number);
      return new Date(año, mes - 1, dia);
    } catch (error) {
      console.error('Error al convertir fecha:', fechaStr);
      return new Date(0);
    }
  }

  filtrarHistorial() {
    this.aplicarFiltros();
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  aplicarFiltros() {
    this.historialFiltrado = this.historialCompleto.filter(test => {
      if (!test.fecha) return false;

      // Filtro por búsqueda (fecha o nivel)
      const cumpleBusqueda = !this.filtroBusqueda ||
        test.fecha.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        test.nivel.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      // Filtro por nivel
      const cumpleNivel = !this.filtroNivel || test.nivel === this.filtroNivel;

      return cumpleBusqueda && cumpleNivel;
    });
  }

  getNivelClass(nivel: string): string {
    const clases: { [key: string]: string } = {
      'mínima': 'bg-emerald-100 text-emerald-800',
      'minima': 'bg-emerald-100 text-emerald-800',
      'leve': 'bg-blue-100 text-blue-800',
      'moderada': 'bg-yellow-100 text-yellow-800',
      'severa': 'bg-red-100 text-red-800'
    };
    const nivelNormalizado = nivel.toLowerCase().trim();
    return clases[nivelNormalizado] || 'bg-gray-100 text-gray-800';
  }

  verDetalle(test: TestResultado) {
    // Validar que existan respuestas
    if (!test.respuestas) {
      Swal.fire('Error', 'No hay detalles disponibles para este test', 'error');
      return;
    }

    // Formatear respuestas para mostrar
    const respuestasHtml = Object.entries(test.respuestas)
      .map(([key, value]) => {
        const numPregunta = key.replace('pregunta', '');
        return `<tr><td class="px-4 py-2">Pregunta ${numPregunta}</td><td class="px-4 py-2">${value !== null ? value : 'No respondida'}</td></tr>`;
      })
      .join('');

    Swal.fire({
      title: `Test del ${test.fecha || 'Fecha desconocida'}`,
      html: `
        <div class="text-left">
          <p><strong>Puntuación:</strong> ${test.puntuacion}</p>
          <p><strong>Nivel:</strong> <span class="capitalize">${test.nivel}</span></p>
          <p><strong>Recomendación:</strong> ${test.recomendacion}</p>
          <hr class="my-3">
          <p class="font-semibold mb-2">Respuestas:</p>
          <table class="w-full text-sm">
            <tbody>
              ${respuestasHtml}
            </tbody>
          </table>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.historialFiltrado.length / this.itemsPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  getItemsPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.historialFiltrado.slice(inicio, fin);
  }

  recargarHistorial() {
    this.cargando = true;
    this.cargarHistorial();
  }

  // Método para obtener el texto de la respuesta
  obtenerTextoRespuesta(valor: number | null): string {
    const opciones: { [key: number]: string } = {
      0: 'Nunca',
      1: 'Varios días',
      2: 'Más de la mitad de los días',
      3: 'Casi todos los días'
    };

    if (valor === null) return 'No respondida';
    return opciones[valor] || `Valor: ${valor}`;
  }

  // Método para obtener interpretación completa
  obtenerInterpretacionCompleta(nivel: "mínima" | "leve" | "moderada" | "severa" | string, puntuacion?: number): string {
    // Mapeo de interpretaciones según el nivel
    const interpretaciones: { [key: string]: string } = {
      'mínima': '✓ Sigue así! Mantén tus hábitos saludables: ejercicio regular, buena alimentación y descanso. Practica la gratitud y mantén conexiones sociales positivas.',
      'minima': '✓ Sigue así! Mantén tus hábitos saludables: ejercicio regular, buena alimentación y descanso. Practica la gratitud y mantén conexiones sociales positivas.',
      'leve': '⚠️ Prueba con respiración profunda (4-7-8): inhala 4s, retén 7s, exhala 8s. Medita 5-10 min diarios con apps como Calm o Headspace. Camina 30 min al aire libre.',
      'moderada': '📌 Establece una rutina de sueño regular (7-9 horas). Reduce cafeína y alcohol. Practica yoga o estiramientos. Escribe tus preocupaciones en un diario.',
      'severa': '🔴 Prioriza tu bienestar: reduce carga laboral, delega tareas. Habla con alguien de confianza. Ejercicio intenso 3-4 veces por semana ayuda a liberar endorfinas.'
    };

    // rangos
    if (puntuacion !== undefined) {
      if (puntuacion <= 5) {
        return `Con ${puntuacion} puntos (ansiedad mínima): ${interpretaciones['mínima']}`;
      } else if (puntuacion <= 10) {
        return `Con ${puntuacion} puntos (ansiedad leve): ${interpretaciones['leve']}`;
      } else if (puntuacion <= 15) {
        return `Con ${puntuacion} puntos (ansiedad moderada): ${interpretaciones['moderada']}`;
      } else {
        return `Con ${puntuacion} puntos (ansiedad severa): ${interpretaciones['severa']}`;
      }
    }

    const nivelNormalizado = nivel.toLowerCase().trim();
    return interpretaciones[nivelNormalizado] || 'Continúa monitoreando tu salud mental. Practica autocuidado diario.';
  }

  imprimirTest(test: TestResultado) {
    // Calcular el nivel correcto basado en la puntuación
    const nivelCorrecto = this.calcularNivelPorPuntuacion(test.puntuacion);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    // Obtener datos
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const nombreUsuario = this.authService.usuarioActual()?.nombre || 'Usuario';

    // Formatear respuestas para la impresión
    const respuestasImpresion = Object.entries(test.respuestas || {})
      .map(([key, value]) => {
        const numPregunta = key.replace('pregunta', '');
        const opcionTexto = this.obtenerTextoRespuesta(value);
        return `
                <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">Pregunta ${numPregunta}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: ${value !== null ? '#374151' : '#9ca3af'}; font-weight: ${value !== null ? 'normal' : 'bold'};">
                        ${opcionTexto}
                    </td>
                </tr>
            `;
      })
      .join('');

    // Crear el contenido HTML para imprimir
    const contenidoImpresion = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resultados del Test - ${test.fecha}</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.6;
                    color: #1f2937;
                    background: #ffffff;
                    padding: 30px;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                
                .container {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                }
                
                /* Encabezado con gradiente */
                .header {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 12px 12px 0 0;
                }
                
                .header h1 {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.95;
                    margin: 5px 0;
                }
                
                .header strong {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                
                /* Tarjetas de información */
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    padding: 30px;
                    background: #f9fafb;
                }
                
                .info-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    border: 1px solid #e5e7eb;
                }
                
                .info-card h3 {
                    color: #6b7280;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }
                
                .info-card .valor {
                    font-size: 36px;
                    font-weight: 700;
                    color: #10b981;
                    line-height: 1.2;
                }
                
                /* Badge de nivel */
                .nivel-badge {
                    display: inline-block;
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 20px;
                    margin: 5px 0;
                }
                
                .nivel-minima { 
                    background: #d1fae5; 
                    color: #065f46;
                    border: 2px solid #10b981;
                }
                .nivel-leve { 
                    background: #dbeafe; 
                    color: #1e40af;
                    border: 2px solid #3b82f6;
                }
                .nivel-moderada { 
                    background: #fef3c7; 
                    color: #92400e;
                    border: 2px solid #f59e0b;
                }
                .nivel-severa { 
                    background: #fee2e2; 
                    color: #991b1b;
                    border: 2px solid #ef4444;
                }
                
                /* Sección de recomendación */
                .recomendacion {
                    background: linear-gradient(to right, #ecfdf5, #ffffff);
                    border-left: 6px solid #10b981;
                    padding: 20px 25px;
                    margin: 20px 30px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                
                .recomendacion strong {
                    color: #10b981;
                    font-size: 18px;
                    display: block;
                    margin-bottom: 10px;
                }
                
                .recomendacion p {
                    color: #374151;
                    font-size: 16px;
                }
                
                /* Tabla de respuestas */
                .tabla-container {
                    padding: 20px 30px;
                }
                
                .tabla-titulo {
                    color: #10b981;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #10b981;
                }
                
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                
                th {
                    background: #10b981;
                    color: white;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 14px;
                    letter-spacing: 0.5px;
                    padding: 15px 12px;
                    text-align: left;
                }
                
                td {
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                tr:last-child td {
                    border-bottom: none;
                }
                
                tbody tr:hover {
                    background: #f9fafb;
                }
                
                /* Interpretación */
                .interpretacion {
                    background: #f3f4f6;
                    border-left: 6px solid #6b7280;
                    padding: 20px 25px;
                    margin: 20px 30px 30px;
                    border-radius: 8px;
                }
                
                .interpretacion strong {
                    color: #4b5563;
                    font-size: 18px;
                    display: block;
                    margin-bottom: 10px;
                }
                
                /* Footer */
                .footer {
                    margin-top: 40px;
                    padding: 20px 30px;
                    border-top: 2px solid #e5e7eb;
                    text-align: center;
                    color: #6b7280;
                    font-size: 13px;
                    background: #f9fafb;
                }
                
                .footer p {
                    margin: 5px 0;
                }
                
                .footer .confidencial {
                    color: #ef4444;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 12px;
                    letter-spacing: 1px;
                }
                
                /* Línea divisoria */
                .divider {
                    height: 2px;
                    background: linear-gradient(to right, transparent, #10b981, transparent);
                    margin: 20px 30px;
                }
                
                @media print {
                    body {
                        padding: 0;
                        background: white;
                    }
                    
                    .info-card {
                        break-inside: avoid;
                    }
                    
                    .header {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    th {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .nivel-badge {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <h1>📋 INFORME DE EVALUACIÓN</h1>
                    <p>Test de Ansiedad - GAD-7</p>
                    <p style="margin-top: 15px;">Paciente: <strong>${nombreUsuario}</strong></p>
                    <p>Fecha del test: <strong>${test.fecha || 'No disponible'}</strong></p>
                </div>

                <!-- Stats Cards -->
                <div class="info-grid">
                    <div class="info-card">
                        <h3>Puntuación Total</h3>
                        <div class="valor">${test.puntuacion}</div>
                        <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">puntos</div>
                    </div>
                    
                    <div class="info-card">
                        <h3>Nivel de Ansiedad</h3>
                        <div class="nivel-badge nivel-${nivelCorrecto}">
                            ${nivelCorrecto.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <h3>Tests Realizados</h3>
                        <div class="valor">${this.historialCompleto.length}</div>
                        <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">en total</div>
                    </div>
                </div>

                <!-- Recomendación Principal -->
                <div class="recomendacion">
                    <strong>🔍 RECOMENDACIÓN PRINCIPAL</strong>
                    <p style="font-size: 16px;">${test.recomendacion || 'Mantén un seguimiento regular de tu salud mental. La prevención es clave para el bienestar emocional.'}</p>
                </div>

                <div class="divider"></div>

                <!-- Tabla de Respuestas -->
                <div class="tabla-container">
                    <div class="tabla-titulo">📊 DETALLE DE RESPUESTAS</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Pregunta</th>
                                <th>Respuesta</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${respuestasImpresion}
                        </tbody>
                    </table>
                </div>

                <!-- Interpretación Detallada -->
                <div class="interpretacion">
                <strong>📌 INTERPRETACIÓN CLÍNICA</strong>
                  <p style="font-size: 15px; color: #374151; line-height: 1.7;">
                   ${this.obtenerInterpretacionCompleta(nivelCorrecto, test.puntuacion)}
                  </p>
                </div>
                <!-- Footer -->
                <div class="footer">
                    <p class="confidencial">⚕️ DOCUMENTO CONFIDENCIAL ⚕️</p>
                    <p>Este informe ha sido generado por el Sistema de Evaluación de Ansiedad</p>
                    <p>Los resultados son orientativos y no sustituyen una evaluación profesional</p>
                    <p style="margin-top: 10px;">© 2024 - Proyecto Web II - Todos los derechos reservados</p>
                </div>
            </div>

            <script>
                // Auto-imprimir inmediatamente
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `;
    iframe.contentDocument?.write(contenidoImpresion);
    iframe.contentDocument?.close();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);

  }
}