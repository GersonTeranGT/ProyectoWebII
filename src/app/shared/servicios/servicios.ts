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
      imagen: "images/psicologia.png",
      categoria: "Psicologia",
      activo: true,
      tags: ["Individual", "Personalizado", "Profesional"]
    },
    {
      id: 2,
      nombre: "Talleres grupales",
      descripcion: "Sesiones prácticas enfocadas en técnicas de relajación y trabajo emocional.",
      imagen: "images/taller.png",
      categoria: "Taller",
      activo: true,
      tags: ["Grupal", "Práctico", "Dinámico"]
    },
    {
      id: 3,
      nombre: "Apoyo académico",
      descripcion: "Programas especiales para estudiantes en periodos de exámenes y alta presión.",
      imagen: "images/estudiante.png",
      categoria: "Academico",
      activo: true,
      tags: ["Estudiantes", "Exámenes", "Técnicas"]
    },
    {
      id: 4,
      nombre: "Recursos digitales",
      descripcion: "Guías, audios y ejercicios diseñados para la autorregulación emocional.",
      imagen: "images/recursos.png",
      categoria: "Digital",
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
