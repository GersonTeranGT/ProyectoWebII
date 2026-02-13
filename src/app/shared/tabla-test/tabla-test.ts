import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TestResultado } from '../../models/testResultado';


@Component({
  selector: 'app-tabla-test',
  imports: [FormsModule, RouterLink],
  templateUrl: './tabla-test.html',
  styleUrl: './tabla-test.css',
})
export class TablaTest {
  // Datos simulados
  historialCompleto: TestResultado[] = [];
  historialFiltrado: TestResultado[] = [];

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

  ngOnInit() {
    this.cargarDatosSimulados();
    this.calcularEstadisticas();
    this.aplicarFiltros();
  }

  cargarDatosSimulados() {
    // Simular datos de historial
    this.historialCompleto = [
      {
        id: 1,
        fecha: '15/03/2025',
        puntuacion: 8,
        nivel: 'leve',
        recomendacion: 'Considera técnicas de relajación.',
        respuestas: { pregunta1: 1, pregunta2: 1, pregunta3: 1, pregunta4: 1, pregunta5: 1, pregunta6: 0, pregunta7: 1, pregunta8: 1, pregunta9: 0, pregunta10: 1 }
      },
      {
        id: 2,
        fecha: '10/03/2025',
        puntuacion: 14,
        nivel: 'moderada',
        recomendacion: 'Recomendamos consultar con un especialista.',
        respuestas: { pregunta1: 2, pregunta2: 1, pregunta3: 2, pregunta4: 1, pregunta5: 1, pregunta6: 2, pregunta7: 1, pregunta8: 2, pregunta9: 1, pregunta10: 1 }
      },
      {
        id: 3,
        fecha: '05/03/2025',
        puntuacion: 4,
        nivel: 'mínima',
        recomendacion: 'Mantén tus hábitos saludables.',
        respuestas: { pregunta1: 0, pregunta2: 1, pregunta3: 0, pregunta4: 1, pregunta5: 0, pregunta6: 1, pregunta7: 0, pregunta8: 1, pregunta9: 0, pregunta10: 0 }
      },
      {
        id: 4,
        fecha: '28/02/2025',
        puntuacion: 22,
        nivel: 'severa',
        recomendacion: 'Te recomendamos buscar ayuda profesional.',
        respuestas: { pregunta1: 3, pregunta2: 2, pregunta3: 3, pregunta4: 2, pregunta5: 2, pregunta6: 2, pregunta7: 2, pregunta8: 2, pregunta9: 2, pregunta10: 2 }
      },
      {
        id: 5,
        fecha: '20/02/2025',
        puntuacion: 6,
        nivel: 'leve',
        recomendacion: 'Considera técnicas de relajación.',
        respuestas: { pregunta1: 1, pregunta2: 1, pregunta3: 1, pregunta4: 0, pregunta5: 1, pregunta6: 1, pregunta7: 0, pregunta8: 1, pregunta9: 0, pregunta10: 0 }
      },
      {
        id: 6,
        fecha: '15/02/2025',
        puntuacion: 11,
        nivel: 'moderada',
        recomendacion: 'Recomendamos consultar con un especialista.',
        respuestas: { pregunta1: 2, pregunta2: 1, pregunta3: 1, pregunta4: 1, pregunta5: 1, pregunta6: 1, pregunta7: 1, pregunta8: 1, pregunta9: 1, pregunta10: 1 }
      }
    ];
  }

  calcularEstadisticas() {
    this.totalTests = this.historialCompleto.length;

    if (this.totalTests > 0) {
      this.ultimoTestFecha = this.historialCompleto[0].fecha;

      const suma = this.historialCompleto.reduce((acc, test) => acc + test.puntuacion, 0);
      const promedio = suma / this.totalTests;
      this.promedioPuntuacion = promedio.toFixed(1);
    }
  }

  filtrarHistorial() {
    this.aplicarFiltros();
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  aplicarFiltros() {
    this.historialFiltrado = this.historialCompleto.filter(test => {
      // Filtro por búsqueda
      const cumpleBusqueda = !this.filtroBusqueda ||
        test.fecha.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        test.nivel.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      // Filtro por nivel
      const cumpleNivel = !this.filtroNivel || test.nivel === this.filtroNivel;

      return cumpleBusqueda && cumpleNivel;
    });
  }

  getNivelClass(nivel: string): string {
    const clases = {
      'mínima': 'bg-emerald-100 text-emerald-800',
      'leve': 'bg-blue-100 text-blue-800',
      'moderada': 'bg-yellow-100 text-yellow-800',
      'severa': 'bg-red-100 text-red-800'
    };
    return clases[nivel as keyof typeof clases] || 'bg-gray-100 text-gray-800';
  }

  verDetalle(test: TestResultado) {
    console.log('Ver detalle:', test);
    // Aquí iría la lógica para mostrar detalles del test
    alert(`Detalles del test del ${test.fecha}\nPuntuación: ${test.puntuacion}\nNivel: ${test.nivel}`);
  }

  eliminarRegistro(test: TestResultado) {
    if (confirm(`¿Estás seguro de eliminar el test del ${test.fecha}?`)) {
      this.historialCompleto = this.historialCompleto.filter(t => t.id !== test.id);
      this.calcularEstadisticas();
      this.aplicarFiltros();
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.historialFiltrado.length / this.itemsPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  getItemsPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.historialFiltrado.slice(inicio, fin);
  }
}
