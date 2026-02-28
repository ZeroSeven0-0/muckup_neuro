/**
 * ============================================================================
 * SESSIONS CONTEXT
 * ============================================================================
 * Ubicación: contexts/SessionsContext.tsx
 * 
 * PROPÓSITO:
 * Este archivo maneja las sesiones de coaching/mentoría entre usuarios y coaches.
 * Permite agendar sesiones, ver sesiones próximas, y trackear su estado.
 * 
 * FLUJO DE AGENDAMIENTO:
 * 1. Usuario propone una fecha/hora en la pantalla de sesiones (app/sessions.tsx)
 * 2. La sesión se crea con status: 'Pendiente'
 * 3. El coach revisa y aprueba/modifica la sesión (esto será en el backend)
 * 4. Cuando se aprueba, el status cambia a 'Confirmada'
 * 
 * ESTRUCTURA DE DATOS:
 * - Session (Sesión):
 *   - id: Identificador único (ej: 's1', 's2')
 *   - title: Nombre de la sesión (ej: "Sesión 1: Estrategia")
 *   - dateLabel: Fecha en formato legible (ej: "Jueves 14 de marzo")
 *   - timeLabel: Hora en formato legible (ej: "18:00h")
 *   - status: 'Confirmada' o 'Pendiente'
 *   - startISO: Fecha/hora de inicio en formato ISO (para ordenar y comparar)
 *   - endISO: Fecha/hora de fin en formato ISO
 * 
 * CÓMO FUNCIONA:
 * 1. Los datos iniciales están en INITIAL_SESSIONS
 * 2. El SessionsProvider envuelve la app y hace disponibles los datos
 * 3. Cualquier componente puede usar useSessions() para acceder a:
 *    - sessions: Array con todas las sesiones
 *    - addSession(session): Función para agregar una nueva sesión
 * 
 * CÓMO USAR EN OTROS COMPONENTES:
 * ```tsx
 * import { useSessions } from '@/contexts/SessionsContext';
 * 
 * function MiComponente() {
 *   const { sessions, addSession } = useSessions();
 *   
 *   // Ver todas las sesiones
 *   sessions.forEach(session => {
 *     console.log(session.title, session.status);
 *   });
 *   
 *   // Agregar nueva sesión
 *   addSession({
 *     id: 's2',
 *     title: 'Sesión 2: Seguimiento',
 *     dateLabel: 'Lunes 18 de marzo',
 *     timeLabel: '19:00h',
 *     status: 'Pendiente',
 *     startISO: '2026-03-18T19:00:00.000Z',
 *     endISO: '2026-03-18T20:00:00.000Z',
 *   });
 * }
 * ```
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * Cuando conectes con el backend de Node.js + Supabase:
 * 1. Reemplaza INITIAL_SESSIONS con un fetch a tu API
 * 2. Modifica addSession para hacer POST al backend
 * 3. Agrega función updateSessionStatus para que el coach apruebe/rechace
 * 4. Implementa notificaciones cuando una sesión cambie de estado
 * 5. Agrega validación de disponibilidad de horarios
 * 6. Considera agregar cancelación de sesiones
 * 
 * ROLES Y PERMISOS:
 * - Usuario: Puede proponer sesiones (status: 'Pendiente')
 * - Coach: Puede aprobar/modificar/rechazar sesiones propuestas
 * - Admin: Puede ver todas las sesiones de todos los usuarios
 * ============================================================================
 */

import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

// Estados posibles de una sesión
export type SessionStatus = 'Confirmada' | 'Pendiente';

// Estructura de una sesión
export type Session = {
  id: string;              // ID único (ej: 's1')
  title: string;           // Nombre de la sesión
  dateLabel: string;       // Fecha legible (ej: "Jueves 14 de marzo")
  timeLabel: string;       // Hora legible (ej: "18:00h")
  status: SessionStatus;   // 'Confirmada' o 'Pendiente'
  startISO: string;        // Fecha/hora inicio ISO (para ordenar)
  endISO: string;          // Fecha/hora fin ISO
};

// Estado global del contexto
type SessionsState = {
  sessions: Session[];                  // Todas las sesiones
  addSession: (session: Session) => void;  // Agregar nueva sesión
};

const SessionsContext = createContext<SessionsState | undefined>(undefined);

/**
 * ============================================================================
 * DATOS INICIALES DE SESIONES
 * ============================================================================
 * Sesión de ejemplo para mostrar cómo funciona el sistema.
 * En producción, estas vendrán del backend según el usuario logueado.
 * ============================================================================
 */
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
 * ============================================================================
 * PROVIDER COMPONENT
 * ============================================================================
 * Este componente envuelve la app y hace disponibles los datos de sesiones.
 * Ya está configurado en app/_layout.tsx - no necesitas modificar esto.
 * ============================================================================
 */
export function SessionsProvider({ children }: { children: ReactNode }) {
  // Estado local que guarda todas las sesiones
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);

  /**
   * Función para agregar una nueva sesión
   * @param session - Objeto Session completo con todos los campos
   * 
   * CÓMO FUNCIONA:
   * 1. Verifica si ya existe una sesión con la misma fecha/hora y título
   * 2. Si existe, no la agrega (evita duplicados)
   * 3. Si no existe, la agrega al inicio del array (más recientes primero)
   * 
   * NOTA: Cuando conectes con el backend, esta función hará un POST
   * a tu API y luego actualizará el estado local con la respuesta.
   */
  const addSession = (session: Session) => {
    setSessions((prev) => {
      // Evitar duplicados: verifica si ya existe una sesión igual
      const exists = prev.some((s) => s.startISO === session.startISO && s.title === session.title);
      if (exists) return prev;
      // Agregar al inicio del array (más recientes primero)
      return [session, ...prev];
    });
  };

  // useMemo optimiza el rendimiento - solo recalcula cuando sessions cambia
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
 * ============================================================================
 * HOOK PERSONALIZADO
 * ============================================================================
 * Usa este hook en cualquier componente para acceder a las sesiones.
 * 
 * EJEMPLO:
 * ```tsx
 * const { sessions, addSession } = useSessions();
 * ```
 * ============================================================================
 */
export function useSessions() {
  const ctx = useContext(SessionsContext);
  if (!ctx) {
    throw new Error('useSessions must be used within SessionsProvider');
  }
  return ctx;
}
