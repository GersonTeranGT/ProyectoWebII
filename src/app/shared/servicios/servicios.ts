import { NgClass } from '@angular/common';
import { Component } from '@angular/core';



@Component({
  selector: 'app-servicios',
  imports: [NgClass],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class Servicios {
  subtitulo: string = "Ofrecemos soluciones integrales orientadas a reducir la ansiedad y mejorar el bienestar emocional.";

  servicioSeleccionado: string = "Ninguno";

  servicios = [
    {
      id: 1,
      nombre: "Orientación psicológica",
      descripcion: "Acompañamiento profesional personalizado para el manejo del estrés y la ansiedad.",
      categoria: "Psicologia",
      color: "blue",
      activo: true,
      tags: ["Individual", "Personalizado", "Profesional"]
    },
    {
      id: 2,
      nombre: "Talleres grupales",
      descripcion: "Sesiones prácticas enfocadas en técnicas de relajación y trabajo emocional.",
      svgPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      categoria: "Taller",
      color: "green",
      activo: true,
      tags: ["Grupal", "Práctico", "Dinámico"]
    },
    {
      id: 3,
      nombre: "Apoyo académico",
      descripcion: "Programas especiales para estudiantes en periodos de exámenes y alta presión.",
      svgPath: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm0 0v7",
      categoria: "Academico",
      color: "purple",
      activo: true,
      tags: ["Estudiantes", "Exámenes", "Técnicas"]
    },
    {
      id: 4,
      nombre: "Recursos digitales",
      descripcion: "Guías, audios y ejercicios diseñados para la autorregulación emocional.",
      svgPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      categoria: "Digital",
      color: "yellow",
      activo: true,
      tags: ["Digital", "Guías", "Audios"]
    }
  ];

  serviciosFiltrados = [...this.servicios];

  seleccionar(nombre: string) {
    this.servicioSeleccionado = nombre;
  }

  busqueda(event: Event) {
    const valor = (event.target as HTMLInputElement).value;

    if (valor.trim() === '') {
      this.subtitulo = "Ofrecemos soluciones integrales orientadas a reducir la ansiedad y mejorar el bienestar emocional.";
      this.serviciosFiltrados = [...this.servicios];
    } else {
      this.subtitulo = `Resultados para: ${valor}`;
      this.serviciosFiltrados = this.servicios.filter(s =>
        s.nombre.toLowerCase().includes(valor.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(valor.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(valor.toLowerCase()))
      );
    }
  }

  limpiarBusqueda() {
    const input = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (input) {
      input.value = '';
      this.busqueda(new Event('input'));
    }
  }

  filtrarPorCategoria(categoria: string) {
    if (categoria === 'Todos') {
      this.serviciosFiltrados = [...this.servicios];
      this.subtitulo = "Ofrecemos soluciones integrales orientadas a reducir la ansiedad y mejorar el bienestar emocional.";
    } else {
      this.serviciosFiltrados = this.servicios.filter(s => s.categoria === categoria);
      this.subtitulo = `Filtrando por categoría: ${this.getCategoriaNombre(categoria)}`;
    }
  }

  private getCategoriaNombre(categoria: string): string {
    const categorias: { [key: string]: string } = {
      'Psicologia': 'Psicología',
      'Taller': 'Talleres',
      'Academico': 'Académico',
      'Digital': 'Digital'
    };
    return categorias[categoria] || categoria;
  }
}
