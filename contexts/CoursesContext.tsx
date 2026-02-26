import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type MediaType = 'video' | 'podcast';

export type Lesson = {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  mediaUrl: string;
  mediaType: MediaType;
  summary: string;
  transcript: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type CoursesState = {
  modules: Module[];
  completeLesson: (moduleId: string, lessonId: string) => void;
};

const CoursesContext = createContext<CoursesState | undefined>(undefined);

const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Curso 1 · Fundamentos de empleabilidad',
    description: 'Alinea tu objetivo profesional y activa tu mentalidad de búsqueda efectiva.',
    lessons: [
      {
        id: 'm1v1',
        title: 'Diagnóstico inicial',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video1',
        mediaType: 'video',
        summary: 'Identifica tu punto de partida con preguntas clave y ejemplos simples.',
        transcript: 'Hoy revisamos cómo evaluar tu situación actual y definir una meta alcanzable.',
      },
      {
        id: 'm1v2',
        title: 'Mapa de objetivos',
        durationMinutes: 2,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video2',
        mediaType: 'video',
        summary: 'Aprende a dividir tu meta en pasos semanales concretos.',
        transcript: 'Vamos a ordenar tus objetivos en una lista corta y fácil de seguir.',
      },
      {
        id: 'm1v3',
        title: 'Primer pasos de acción',
        durationMinutes: 2,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video7',
        mediaType: 'video',
        summary: 'Establece acciones simples para tu semana inicial.',
        transcript: 'Tres acciones cortas que puedes realizar hoy para avanzar.',
      },
    ],
  },
  {
    id: 'm2',
    title: 'Curso 2 · Marca profesional',
    description: 'Construye una narrativa clara y memorable sobre quién eres y qué aportas.',
    lessons: [
      {
        id: 'm2p1',
        title: 'Perfil LinkedIn neuro-amigable',
        durationMinutes: 2,
        completed: false,
        mediaUrl: 'https://open.spotify.com/episode/podcast2',
        mediaType: 'podcast',
        summary: 'Checklist rápido para ordenar tu LinkedIn sin saturar de texto.',
        transcript: 'Te comparto una estructura simple para destacar tus habilidades.',
      },
      {
        id: 'm2p2',
        title: 'Tu propuesta de valor (audio)',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://open.spotify.com/episode/podcast6',
        mediaType: 'podcast',
        summary: 'Define tu valor con ejemplos de impacto en proyectos reales.',
        transcript: 'Hablamos de logros concretos y cómo expresarlos con claridad.',
      },
      {
        id: 'm2p3',
        title: 'Historia profesional en 60 segundos',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://open.spotify.com/episode/podcast3',
        mediaType: 'podcast',
        summary: 'Estructura breve para contar tu historia con seguridad.',
        transcript: 'Una guía paso a paso para tu presentación profesional.',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Curso 3 · Entrevistas',
    description: 'Convierte tus evidencias en historias que las empresas recuerden.',
    lessons: [
      {
        id: 'm3v1',
        title: 'Preguntas frecuentes',
        durationMinutes: 1,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video5',
        mediaType: 'video',
        summary: 'Prepárate con respuestas claras a las preguntas más comunes.',
        transcript: 'Cómo responder “cuéntame de ti” en menos de un minuto.',
      },
      {
        id: 'm3v2',
        title: 'Simulaciones guiadas',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video6',
        mediaType: 'video',
        summary: 'Ejemplos de entrevistas rápidas para practicar tu tono.',
        transcript: 'Te muestro una simulación corta con feedback inmediato.',
      },
      {
        id: 'm3v3',
        title: 'Errores comunes en entrevistas',
        durationMinutes: 2,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=video8',
        mediaType: 'video',
        summary: 'Errores típicos y cómo evitarlos con frases simples.',
        transcript: 'Señales de alerta y cómo corregirlas en el momento.',
      },
    ],
  },
];

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);

  const completeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) {
          return module;
        }
        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          ),
        };
      })
    );
  };

  const value = useMemo(
    () => ({
      modules,
      completeLesson,
    }),
    [modules]
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) {
    throw new Error('useCourses must be used within CoursesProvider');
  }
  return ctx;
}
