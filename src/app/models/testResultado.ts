export interface TestResultado {
  id: number;
  fecha: string;
  puntuacion: number;
  nivel: 'mínima' | 'leve' | 'moderada' | 'severa';
  recomendacion: string;
  respuestas?: {
    pregunta1: number | null;
    pregunta2: number | null;
    pregunta3: number | null;
    pregunta4: number | null;
    pregunta5: number | null;
    pregunta6: number | null;
    pregunta7: number | null;
    pregunta8: number | null;
    pregunta9: number | null;
    pregunta10: number | null;
  };
}

export interface RespuestasTest {
  pregunta1: number | null;
  pregunta2: number | null;
  pregunta3: number | null;
  pregunta4: number | null;
  pregunta5: number | null;
  pregunta6: number | null;
  pregunta7: number | null;
  pregunta8: number | null;
  pregunta9: number | null;
  pregunta10: number | null;
}

export interface OpcionRespuesta {
  valor: number;
  texto: string;
}

export const OPCIONES_RESPUESTA: OpcionRespuesta[] = [
  { valor: 0, texto: 'Nunca' },
  { valor: 1, texto: 'Varios días' },
  { valor: 2, texto: 'Más de la mitad de los días' },
  { valor: 3, texto: 'Casi todos los días' }
];

export const INTERPRETACIONES = [
  { max: 5, nivel: 'mínima', mensaje: 'Ansiedad mínima. Mantén tus hábitos saludables.' },
  { max: 10, nivel: 'leve', mensaje: 'Ansiedad leve. Considera técnicas de relajación.' },
  { max: 15, nivel: 'moderada', mensaje: 'Ansiedad moderada. Recomendamos consultar con un especialista.' },
  { max: 30, nivel: 'severa', mensaje: 'Ansiedad severa. Te recomendamos buscar ayuda profesional.' }
];