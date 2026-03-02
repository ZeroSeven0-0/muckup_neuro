/**
 * ============================================================================
 * SESSIONS CONTEXT (CONTEXTO DE SESIONES DE COACHING)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Context de React que maneja las sesiones de coaching 1:1 entre el usuario
 * y su coach. Permite agregar, listar y gestionar sesiones agendadas.
 * 
 * ESTRUCTURA DE DATOS:
 * 
 * Session (Sesión):
 * - id: Identificador único de la sesión (ej: 's1', 's2')
 * - title: Título de la sesión (ej: 'Sesión 1: Estrategia')
 * - dateLabel: Fecha en formato legible (ej: 'Jueves 14 de marzo')
 * - timeLabel: Hora en formato legible (ej: '18:00h')
 * - status: Estado de la sesión (ver SessionStatus)
 * - startISO: (opcional) Fecha/hora de inicio en formato ISO
 * - endISO: (opcional) Fecha/hora de fin en formato ISO
 * - notes: (opcional) Notas adicionales sobre la sesión
 * 
 * SessionStatus (Estados posibles):
 * - 'Confirmada': Sesión confirmada por ambas partes
 * - 'Pendiente': Esperando confirmación del coach
 * - 'Cambio sugerido': Coach sugirió cambio de fecha/hora
 * 
 * FUNCIONALIDAD:
 * 
 * 1. sessions (Array<Session>)
 *    - Lista de todas las sesiones agendadas
 *    - Ordenadas con las más recientes primero
 * 
 * 2. addSession(session: Session)
 *    - Agrega una nueva sesión a la lista
 *    - Previene duplicados (compara title, dateLabel, timeLabel)
 *    - Agrega al inicio del array (más recientes primero)
 * 
 * USO EN COMPONENTES:
 * 
 * import { useSessions } from '@/contexts/SessionsContext';
 * 
 * function MyComponent() {
 *   const { sessions, addSession } = useSessions();
 *   
 *   // Listar sesiones
 *   sessions.forEach(session => {
 *     console.log(session.title, session.status);
 *   });
 *   
 *   // Agregar nueva sesión
 *   addSession({
 *     id: 's2',
 *     title: 'Sesión 2: Entrevistas',
 *     dateLabel: 'Lunes 18 de marzo',
 *     timeLabel: '10:00h',
 *     status: 'Pendiente'
 *   });
 * }
 * 
 * DÓNDE SE USA:
 * - app/(tabs)/index.tsx (Dashboard) - Muestra próximas sesiones
 * - app/sessions.tsx - Lista completa de sesiones
 * - app/(tabs)/agenda.tsx - Formulario para agendar nuevas sesiones
 * 
 * DATOS INICIALES:
 * INITIAL_SESSIONS contiene una sesión de ejemplo. En producción,
 * estos datos deberían venir del backend.
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * Cuando conectes con Node.js + Supabase:
 * 1. Reemplaza INITIAL_SESSIONS con fetch a tu API
 * 2. Modifica addSession para hacer POST al backend
 * 3. Agrega funciones para actualizar/eliminar sesiones
 * 4. Implementa sincronización en tiempo real (Supabase Realtime)
 * 5. Agrega notificaciones cuando el coach confirme/cambie sesiones
 * 
 * FLUJO DE AGENDAMIENTO:
 * 1. Usuario propone fecha/hora en app/(tabs)/agenda.tsx
 * 2. Se crea sesión con status 'Pendiente'
 * 3. Coach recibe notificación (backend)
 * 4. Coach confirma o sugiere cambio
 * 5. Status cambia a 'Confirmada' o 'Cambio sugerido'
 * 6. Usuario recibe notificación del cambio de estado
 */

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Estados posibles de una sesión
export type SessionStatus = 'Confirmada' | 'Pendiente' | 'Cambio sugerido';

// Estructura de una sesión de coaching
export type Session = {
  id: string;                    // ID único
  title: string;                 // Título de la sesión
  dateLabel: string;             // Fecha legible (ej: 'Jueves 14 de marzo')
  timeLabel: string;             // Hora legible (ej: '18:00h')
  status: SessionStatus;         // Estado de la sesión
  startISO?: string;             // Fecha/hora inicio ISO (opcional)
  endISO?: string;               // Fecha/hora fin ISO (opcional)
  notes?: string;                // Notas adicionales (opcional)
};

// Tipo del contexto
type SessionsState = {
  sessions: Session[];                    // Lista de sesiones
  addSession: (session: Session) => void; // Función para agregar sesión
};

// Crear el contexto
const SessionsContext = createContext<SessionsState | undefined>(undefined);

// Sesiones iniciales de ejemplo
// TODO: Reemplazar con datos del backend
const INITIAL_SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Sesión 1: Estrategia',
    dateLabel: 'Jueves 14 de marzo',
    timeLabel: '18:00h',
    status: 'Confirmada',
    startISO: '2026-03-14T18:00:00.000Z',
    endISO: '2026-03-14T19:00:00.000Z',
  },
];

/**
 * Provider que envuelve la app y proporciona las sesiones
 * Se usa en app/_layout.tsx
 */
export function SessionsProvider({ children }: { children: ReactNode }) {
  // Estado con las sesiones
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  /**
   * Agrega una nueva sesión a la lista
   * Previene duplicados comparando title, dateLabel y timeLabel
   */
  const addSession = (session: Session) => {
    setSessions((prev) => {
      // Verificar si ya existe una sesión idéntica
      const exists = prev.some(
        (s) =>
          s.title === session.title &&
          s.dateLabel === session.dateLabel &&
          s.timeLabel === session.timeLabel
      );
      
      // Si existe, no agregar duplicado
      if (exists) return prev;
      
      // Agregar al inicio (más recientes primero)
      return [session, ...prev];
    });
  };

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(
    () => ({
      sessions,
      addSession,
    }),
    [sessions]
  );

  return <SessionsContext.Provider value={value}>{children}</SessionsContext.Provider>;
}

/**
 * Hook personalizado para acceder a las sesiones
 * Lanza error si se usa fuera del Provider
 */
export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) {
    throw new Error('useSessions must be used within SessionsProvider');
  }
  return ctx;
}
