/**
 * ============================================================================
 * ACHIEVEMENTS DATA (DATOS DE LOGROS)
 * ============================================================================
 * Ubicación: constants/b2c-mock.ts
 * 
 * PROPÓSITO:
 * Este archivo contiene todos los logros/badges disponibles en la app.
 * Define la estructura de datos y la lista completa de logros.
 * 
 * ESTRUCTURA DE UN LOGRO:
 * - id: Identificador único (usado para verificar si está desbloqueado)
 * - title: Nombre del logro
 * - description: Descripción de lo que representa
 * - condition: Texto que explica cómo desbloquearlo
 * - points: Puntos que otorga (no usado actualmente)
 * - icon: Nombre del ícono de Ionicons
 * 
 * LOGROS DISPONIBLES (11 total):
 * 1. Primer Paso - Completar 1 módulo
 * 2. Maestro del CV - Completar módulo de CV
 * 3. Listo para Entrevistas - Completar módulo de entrevistas
 * 4. LinkedIn Pro - Optimizar perfil de LinkedIn
 * 5. Ninja del Networking - Registrar contactos y mensajes
 * 6. Cazador de Empleo - Registrar postulaciones
 * 7. Estrella Soft Skills - Completar lecciones de soft skills
 * 8. Neuro-Impulso I - Completar 3 sesiones
 * 9. Neuro-Impulso II - Completar 2 módulos + agendar sesión
 * 10. Neuro-Impulso III - Completar ruta completa
 * 11. Curso Completado - Completar todos los módulos
 * 
 * CÓMO SE DESBLOQUEAN:
 * Los logros se calculan en tiempo real en las pantallas que los muestran:
 * - Dashboard (app/(tabs)/index.tsx)
 * - Profile → Logros (app/profile.tsx)
 * - Achievements (app/achievements.tsx)
 * 
 * CÓMO AGREGAR UN NUEVO LOGRO:
 * 1. Agrega un nuevo objeto al array ACHIEVEMENTS
 * 2. Define un id único (ej: 'new_achievement')
 * 3. Completa todos los campos requeridos
 * 4. Agrega la lógica de desbloqueo en los archivos que calculan logros
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - Los logros vendrán de la API
 * - Se calcularán en el backend según el progreso del usuario
 * - Se sincronizarán automáticamente al completar acciones
 * ============================================================================
 */

// Tipo de dato para un logro
export type Achievement = {
  id: string;              // ID único del logro
  title: string;           // Nombre del logro
  description: string;     // Descripción de lo que representa
  condition: string;       // Cómo desbloquearlo
  points: number;          // Puntos que otorga (no usado actualmente)
  icon:                    // Ícono de Ionicons
    | 'star'
    | 'document-text'
    | 'chatbubbles'
    | 'logo-linkedin'
    | 'people'
    | 'briefcase'
    | 'heart'
    | 'flash'
    | 'trophy';
};

/**
 * Lista completa de logros disponibles en la app
 * Cada logro tiene condiciones específicas para desbloquearse
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Primer Paso',
    description: 'Completaste tu primer módulo y activaste tu ruta de transformación.',
    condition: 'Completa 1 módulo al 100%.',
    points: 50,
    icon: 'star',
  },
  {
    id: 'cv_master',
    title: 'Maestro del CV',
    description: 'Dominaste la optimización del CV y dejaste tu historia profesional impecable.',
    condition: 'Finaliza el módulo “CV” y marca la lección final como completada.',
    points: 100,
    icon: 'document-text',
  },
  {
    id: 'interview_ready',
    title: 'Listo para Entrevistas',
    description: 'Completaste la preparación esencial para entrevistas con evidencias claras.',
    condition: 'Completa el módulo de entrevistas y guarda una simulación.',
    points: 150,
    icon: 'chatbubbles',
  },
  {
    id: 'linkedin_pro',
    title: 'LinkedIn Pro',
    description: 'Tu perfil está optimizado y listo para atraer oportunidades reales.',
    condition: 'Completa la checklist de LinkedIn (titular, acerca de, experiencia, skills).',
    points: 100,
    icon: 'logo-linkedin',
  },
  {
    id: 'networking_ninja',
    title: 'Ninja del Networking',
    description: 'Activaste networking estratégico con acciones consistentes y medibles.',
    condition: 'Registra 5 contactos nuevos y 2 mensajes de alcance.',
    points: 100,
    icon: 'people',
  },
  {
    id: 'job_hunter',
    title: 'Cazador de Empleo',
    description: 'Dominas tu sistema de búsqueda con foco, registro y priorización.',
    condition: 'Registra 10 postulaciones y 3 seguimientos.',
    points: 100,
    icon: 'briefcase',
  },
  {
    id: 'soft_skills_star',
    title: 'Estrella Soft Skills',
    description: 'Fortaleciste habilidades blandas clave para desempeño y colaboración.',
    condition: 'Completa 3 micro-lecciones de comunicación y feedback.',
    points: 100,
    icon: 'heart',
  },
  {
    id: 'neuro_impulso_1',
    title: 'Neuro-Impulso I',
    description: 'Primer hito de neurodiversidad: construyes estructura y ritmo sostenible.',
    condition: 'Completa 3 sesiones cortas en días distintos.',
    points: 200,
    icon: 'flash',
  },
  {
    id: 'neuro_impulso_2',
    title: 'Neuro-Impulso II',
    description: 'Segundo hito: mantienes consistencia con herramientas y autocuidado.',
    condition: 'Completa 2 módulos y agenda 1 sesión de coaching.',
    points: 300,
    icon: 'flash',
  },
  {
    id: 'neuro_impulso_3',
    title: 'Neuro-Impulso III',
    description: 'Máximo nivel: foco, evidencia y estrategia alineadas.',
    condition: 'Completa la ruta completa.',
    points: 500,
    icon: 'trophy',
  },
  {
    id: 'course_complete',
    title: 'Curso Completado',
    description: '¡Felicidades! Cerraste el proceso y consolidaste tu perfil profesional.',
    condition: 'Completa todos los módulos de la ruta.',
    points: 0,
    icon: 'trophy',
  },
];

