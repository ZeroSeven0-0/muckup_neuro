/**
 * ============================================================================
 * UTILIDAD DE CÁLCULO DE LOGROS (ACHIEVEMENTS)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Función que calcula qué logros ha desbloqueado el usuario basándose en
 * su progreso en los módulos y lecciones del curso. Esta lógica centralizada
 * asegura que los logros se calculen de forma consistente en toda la app.
 * 
 * LÓGICA DE DESBLOQUEO:
 * Los logros se desbloquean automáticamente cuando el usuario cumple ciertas
 * condiciones de progreso:
 * 
 * 1. 'first_step' - Completar 1 módulo completo
 * 2. 'neuro_impulso_1' - Completar 3 lecciones (de cualquier módulo)
 * 3. 'neuro_impulso_2' - Completar 2 módulos completos
 * 4. 'neuro_impulso_3' - Completar TODOS los módulos del curso
 * 5. 'course_complete' - Completar TODOS los módulos del curso
 * 6. 'soft_skills_star' - Completar 3 lecciones (de cualquier módulo)
 * 7. 'interview_ready' - Completar el módulo de "Entrevistas"
 * 
 * DEFINICIÓN DE "MÓDULO COMPLETO":
 * Un módulo se considera completo cuando TODAS sus lecciones tienen
 * la propiedad `completed: true`
 * 
 * USO:
 * Esta función se llama en:
 * - Dashboard (app/(tabs)/index.tsx) - Para mostrar logros desbloqueados
 * - Profile (app/profile.tsx) - Para mostrar todos los logros con estado
 * - Achievements (app/achievements.tsx) - Para la pantalla de logros
 * 
 * DATOS DE LOGROS:
 * Los datos completos de cada logro (título, descripción, icono, condición)
 * están definidos en `constants/b2c-mock.ts` en el array ACHIEVEMENTS
 * 
 * @param modules - Array de módulos del curso con sus lecciones
 * @returns Objeto con IDs de logros desbloqueados y estadísticas de progreso
 */

import type { Module } from '@/contexts/CoursesContext';

/**
 * Calcula qué logros ha desbloqueado el usuario basándose en su progreso
 */
export function getEarnedAchievements(modules: Module[]) {
  // ========== CALCULAR ESTADÍSTICAS DE PROGRESO ==========
  
  // Módulos completos: todos sus lessons tienen completed: true
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((lesson) => lesson.completed)
  );
  
  // Contar lecciones completadas en total (de todos los módulos)
  const completedLessonsCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  
  // Total de módulos en el curso
  const totalModules = modules.length;

  // ========== DETERMINAR LOGROS DESBLOQUEADOS ==========
  
  // Set para almacenar IDs de logros desbloqueados (evita duplicados)
  const earnedIds = new Set<string>();
  
  // Logro: Completar 1 módulo
  if (completedModules.length >= 1) earnedIds.add('first_step');
  
  // Logro: Completar 2 módulos
  if (completedModules.length >= 2) earnedIds.add('neuro_impulso_2');
  
  // Logros: Completar TODOS los módulos
  if (completedModules.length === totalModules && totalModules > 0) {
    earnedIds.add('neuro_impulso_3');
    earnedIds.add('course_complete');
  }
  
  // Logros: Completar 3 lecciones (de cualquier módulo)
  if (completedLessonsCount >= 3) {
    earnedIds.add('soft_skills_star');
    earnedIds.add('neuro_impulso_1');
  }
  
  // Logro especial: Completar el módulo de "Entrevistas"
  const entrevistasModule = modules.find((m) => m.title.toLowerCase().includes('entrevistas'));
  if (entrevistasModule && entrevistasModule.lessons.every((lesson) => lesson.completed)) {
    earnedIds.add('interview_ready');
  }

  // ========== RETORNAR RESULTADOS ==========
  
  return {
    earnedIds,                    // Set con IDs de logros desbloqueados
    earnedCount: earnedIds.size,  // Cantidad de logros desbloqueados
    completedModulesCount: completedModules.length,  // Módulos completos
    completedLessonsCount,        // Lecciones completadas en total
    totalModules,                 // Total de módulos en el curso
  };
}
