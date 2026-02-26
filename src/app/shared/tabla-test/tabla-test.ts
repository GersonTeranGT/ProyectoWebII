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
    
    // Opción 1: Escuchar cambios en los parámetros de la URL
    

    // Opción 2: Escuchar cuando se navega a la misma ruta
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
      this.historialCompleto = tests;
      this.historialFiltrado = [...tests];
      console.log('📋 historialCompleto:', this.historialCompleto);
      console.log('🔍 historialFiltrado:', this.historialFiltrado);
      
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
    // Validar que la fecha tenga el formato correcto
    if (!fechaStr || fechaStr === '--/--/----') {
      return new Date(0); // Fecha por defecto
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
      // Si no hay fecha, no pasar filtros de búsqueda
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
      'leve': 'bg-blue-100 text-blue-800',
      'moderada': 'bg-yellow-100 text-yellow-800',
      'severa': 'bg-red-100 text-red-800'
    };
    return clases[nivel] || 'bg-gray-100 text-gray-800';
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
    this.cargando= true;
    this.cargarHistorial();
  }
}
