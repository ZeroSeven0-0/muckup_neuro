/**
 * ============================================================================
 * AGENDA TAB (RE-EXPORT DE SESSIONS)
 * ============================================================================
 * Ubicación: app/(tabs)/agenda.tsx
 * 
 * PROPÓSITO:
 * Este archivo es un simple re-export de la pantalla de sesiones.
 * Permite que la pantalla de sesiones aparezca como un tab en el menú inferior.
 * 
 * FUNCIONAMIENTO:
 * - Cuando el usuario toca el tab "Agenda", se muestra app/sessions.tsx
 * - Es una forma de reutilizar la misma pantalla en diferentes rutas
 * 
 * NOTA: Este patrón es útil cuando quieres que una pantalla esté disponible:
 * 1. Como tab en el menú inferior (/(tabs)/agenda)
 * 2. Como pantalla independiente (/sessions)
 * 
 * ALTERNATIVA: Podrías mover todo el código de sessions.tsx aquí directamente,
 * pero mantenerlo separado permite mayor flexibilidad.
 * ============================================================================
 */

export { default } from '../sessions';

