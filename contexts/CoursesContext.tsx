/**
 * ============================================================================
 * COURSES CONTEXT
 * ============================================================================
 * Ubicación: contexts/CoursesContext.tsx
 * 
 * PROPÓSITO:
 * Este archivo maneja toda la información de cursos, módulos y lecciones de la app.
 * Proporciona los datos de contenido educativo (videos y podcasts) y permite
 * marcar lecciones como completadas para trackear el progreso del usuario.
 * 
 * ESTRUCTURA DE DATOS:
 * - Module (Curso): Contiene un grupo de lecciones relacionadas
 *   - id: Identificador único del módulo (ej: 'm1', 'm2')
 *   - title: Nombre del curso (ej: "Curso 1 · Aprende a reirte")
 *   - description: Descripción breve del contenido
 *   - lessons: Array de lecciones que pertenecen a este módulo
 * 
 * - Lesson (Lección): Contenido individual (video o podcast)
 *   - id: Identificador único (ej: 'm1v1', 'm2p1')
 *   - title: Nombre de la lección
 *   - durationMinutes: Duración aproximada en minutos
 *   - completed: Boolean que indica si el usuario completó esta lección
 *   - mediaUrl: URL del contenido (YouTube, Spotify, archivo directo)
 *   - mediaType: 'video' o 'podcast'
 *   - summary: Resumen corto del contenido
 *   - transcript: Transcripción completa del contenido
 * 
 * CÓMO FUNCIONA:
 * 1. Los datos iniciales están en INITIAL_MODULES (más abajo en este archivo)
 * 2. El CoursesProvider envuelve la app y hace disponibles los datos
 * 3. Cualquier componente puede usar useCourses() para acceder a:
 *    - modules: Array con todos los cursos y sus lecciones
 *    - completeLesson(moduleId, lessonId): Función para marcar lección como completada
 * 
 * CÓMO USAR EN OTROS COMPONENTES:
 * ```tsx
 * import { useCourses } from '@/contexts/CoursesContext';
 * 
 * function MiComponente() {
 *   const { modules, completeLesson } = useCourses();
 *   
 *   // Ver todos los módulos
 *   modules.forEach(module => {
 *     console.log(module.title);
 *   });
 *   
 *   // Marcar lección como completada
 *   completeLesson('m1', 'm1v1');
 * }
 * ```
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * Cuando conectes con el backend de Node.js + Supabase:
 * 1. Reemplaza INITIAL_MODULES con un fetch a tu API
 * 2. Modifica completeLesson para hacer POST/PUT al backend
 * 3. Agrega sincronización para guardar progreso en la base de datos
 * 4. Considera agregar loading states y error handling
 * 
 * CÓMO AGREGAR NUEVOS CURSOS:
 * 1. Ve a INITIAL_MODULES (línea ~80)
 * 2. Agrega un nuevo objeto Module al array
 * 3. Asegúrate de usar IDs únicos (ej: 'm5', 'm6')
 * 4. Agrega las lecciones dentro del array lessons
 * 5. Usa IDs únicos para lecciones (ej: 'm5v1', 'm5p1')
 * ============================================================================
 */

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Tipo de medio: video (YouTube, MP4) o podcast (Spotify, MP3)
export type MediaType = 'video' | 'podcast';

// Estructura de una lección individual
export type Lesson = {
  id: string;                    // ID único (ej: 'm1v1')
  title: string;                 // Nombre de la lección
  durationMinutes: number;       // Duración aproximada
  completed: boolean;            // Si el usuario la completó
  mediaUrl: string;              // URL del contenido
  mediaType: MediaType;          // 'video' o 'podcast'
  summary: string;               // Resumen corto
  transcript: string;            // Transcripción completa
};

// Estructura de un módulo/curso
export type Module = {
  id: string;                    // ID único (ej: 'm1')
  title: string;                 // Nombre del curso
  description: string;           // Descripción breve
  lessons: Lesson[];             // Array de lecciones
};

// Estado global del contexto
type CoursesState = {
  modules: Module[];                                              // Todos los cursos
  completeLesson: (moduleId: string, lessonId: string) => void;  // Marcar lección completada
};

const CoursesContext = createContext<CoursesState | undefined>(undefined);

/**
 * ============================================================================
 * DATOS INICIALES DE CURSOS
 * ============================================================================
 * Aquí están todos los cursos y lecciones de la app.
 * 
 * ESTRUCTURA:
 * - Cada módulo tiene un ID único (m1, m2, m3, m4)
 * - Cada lección tiene un ID que combina módulo + tipo + número (m1v1, m2p1)
 *   - v = video, p = podcast
 * 
 * CÓMO AGREGAR UN NUEVO CURSO:
 * 1. Copia un módulo existente
 * 2. Cambia el ID (ej: 'm5')
 * 3. Actualiza title y description
 * 4. Agrega tus lecciones con IDs únicos (ej: 'm5v1', 'm5v2', 'm5p1')
 * 
 * CÓMO AGREGAR UNA NUEVA LECCIÓN:
 * 1. Ve al módulo correspondiente
 * 2. Agrega un nuevo objeto Lesson al array lessons
 * 3. Usa un ID único (ej: si ya existe m1v3, usa m1v4)
 * 4. Completa todos los campos requeridos
 * 
 * NOTA: Cuando conectes con el backend, estos datos vendrán de la API
 * ============================================================================
 */
const INITIAL_MODULES: Module[] = [
  {
    id: 'm1',
    title: 'Curso 1 · Aprende a reirte',
    description: 'Videos cortos para desconectar y reírte un rato.',
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
      {
        id: 'm1v4',
        title: 'memes de risa',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://youtu.be/oUfX-uWPhuA?si=P8iKXLN9KizllaHb',
        mediaType: 'video',
        summary: 'Resumen corto de 1–2 frases',
        transcript: `[Music]
0:06 caramelizes down it's super fragrant and
0:09 very very sweet that's gonna literally
0:11 give that wonderful flavor bring that
0:13 back up to the boil and it'll have a
0:15 slight crunch left in there let the pan
0:18 do the work and get that beautiful color
0:20 in there
0:21 you
0:23 set that on top of there
0:26 all right
0:28 [Music]
0:39 you can use this rotation device ah
0:42 floating
0:43 floating they're gonna be hating
0:46 football feet if you put both feet we'll
0:49 give you a big bag of seeds sit damn it
0:51 man see premium from Costco to contain
0:55 plate I have to consider I'm aquaphobic
0:58 man
0:59 why do I have to be aquaphobic flotation
1:02 device few moments later I told you you
1:05 can trust me
1:08 who do you trust then me man I trust me
1:12 what what hey I lifted it you lifted it
1:18 and I just float excuse me may I just
1:22 float so politely of course you can bro
1:25 you know what happened last time just
1:27 drive careful please
1:28 [Music]
1:36 oh
1:50 thank you
1:54 [Music]
1:59 come sit down please
2:02 cow
2:04 on top of you
2:05 stop sit down baby come on look how high
2:09 we are
2:11 next okay the show what the [ __ ] hey
2:15 how's it going guys you want to go check
2:17 out what's going on over there
2:32 hey bro
2:35 foreign
3:00 [Music]`,
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
  {
    id: 'm4',
    title: 'Curso de prueba',
    description: 'Módulo temporal para probar el reproductor con distintos orígenes.',
    lessons: [
      {
        id: 'm4v1',
        title: 'Hetero por opcion',
        durationMinutes: 2,
        completed: false,
        mediaUrl: 'https://youtu.be/iolfUh-ZPYM?si=NZNgmaaJJP5_ptJ9',
        mediaType: 'video',
        summary: 'cancion padrinos magic.',
        transcript: '',
      },
      {
        id: 'm4v2',
        title: 'YouTube demo',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
        mediaType: 'video',
        summary: 'Video de ejemplo compatible con embed.',
        transcript: `0:00 [Música]
0:01 heterosexual por la opción excelente
0:06 [Música]
0:22 nos miran en la calle en el aspecto
0:30 [Música]
0:35 somos gemelas
0:38 [Música]
0:40 nuestros nombres son somos sinceros
0:44 sexuales
0:53 [Música]
0:59 [Música]
1:05 nos gustan las mujeres
1:07 [Música]
1:08 somos heterosexuales
1:14 [Música]
1:20 [Música]
1:27 calientes y también somos heteros
1:29 sexuales
1:31 nos gustan las mujeres
1:33 [Música]
1:36 sensuales
1:40 [Música]
1:52 [Música]
1:53 calientes y también somos heteros
1:55 sexuales
1:57 nos gustan las mujeres
1:59 [Música]
2:01 somos
2:03 heterosexuales por acción`,
      },
      {
        id: 'm4p1',
        title: 'Podcast MP3 de prueba',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://open.spotify.com/intl-es/track/6Pm4yjo948yyjI2biDpW4q?si=8026072b43b44039',
        mediaType: 'podcast',
        summary: 'Audio de prueba para el reproductor.',
        transcript: '',
      },
    ],
  },
];

/**
 * ============================================================================
 * PROVIDER COMPONENT
 * ============================================================================
 * Este componente envuelve la app y hace disponibles los datos de cursos.
 * Ya está configurado en app/_layout.tsx - no necesitas modificar esto.
 * ============================================================================
 */
export function CoursesProvider({ children }: { children: ReactNode }) {
  // Estado local que guarda todos los módulos
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);

  /**
   * Función para marcar una lección como completada
   * @param moduleId - ID del módulo (ej: 'm1')
   * @param lessonId - ID de la lección (ej: 'm1v1')
   * 
   * CÓMO FUNCIONA:
   * 1. Busca el módulo correcto por ID
   * 2. Dentro de ese módulo, busca la lección por ID
   * 3. Cambia completed: false a completed: true
   * 4. Actualiza el estado para que la UI se actualice
   */
  const completeLesson = (moduleId: string, lessonId: string) => {
    setModules((prev) =>
      prev.map((module) => {
        // Si no es el módulo correcto, déjalo sin cambios
        if (module.id !== moduleId) {
          return module;
        }
        // Si es el módulo correcto, actualiza la lección
        return {
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          ),
        };
      })
    );
  };

  // useMemo optimiza el rendimiento - solo recalcula cuando modules cambia
  const value = useMemo(
    () => ({
      modules,
      completeLesson,
    }),
    [modules]
  );

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
}

/**
 * ============================================================================
 * HOOK PERSONALIZADO
 * ============================================================================
 * Usa este hook en cualquier componente para acceder a los cursos.
 * 
 * EJEMPLO:
 * ```tsx
 * const { modules, completeLesson } = useCourses();
 * ```
 * ============================================================================
 */
export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) {
    throw new Error('useCourses must be used within CoursesProvider');
  }
  return ctx;
}
