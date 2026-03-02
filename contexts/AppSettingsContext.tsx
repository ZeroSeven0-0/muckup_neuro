/**
 * ============================================================================
 * APP SETTINGS CONTEXT (CONFIGURACIÓN GLOBAL DE ACCESIBILIDAD Y TEMA)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Context de React que maneja toda la configuración de accesibilidad y
 * personalización de la app. Permite que cualquier componente acceda y
 * modifique estas configuraciones de forma centralizada.
 * 
 * CONFIGURACIONES DISPONIBLES:
 * 
 * 1. theme (ThemeMode: 'dark' | 'light')
 *    - Tema visual de la app (oscuro o claro)
 *    - Default: 'dark'
 *    - Afecta colores de fondo, texto y componentes
 * 
 * 2. highContrast (boolean)
 *    - Activa bordes de alto contraste en elementos interactivos
 *    - Default: true
 *    - Ayuda a usuarios con baja visión a identificar elementos
 * 
 * 3. easyReading (boolean)
 *    - Activa modo de lectura fácil (textos simplificados)
 *    - Default: false
 *    - Muestra versiones más cortas y simples de los textos
 *    - Ayuda a usuarios con dificultades cognitivas o de comprensión
 * 
 * 4. largeText (boolean)
 *    - Aumenta el tamaño de fuente en toda la app
 *    - Default: false
 *    - Ayuda a usuarios con baja visión
 * 
 * 5. haptics (boolean)
 *    - Activa/desactiva retroalimentación háptica (vibraciones)
 *    - Default: true
 *    - Proporciona confirmación táctil de interacciones
 * 
 * 6. noBorders (boolean)
 *    - Elimina todos los bordes de elementos
 *    - Default: false
 *    - Útil para usuarios que prefieren interfaces más limpias
 *    - Cuando está activo, los elementos tienen fondo transparente
 * 
 * USO EN COMPONENTES:
 * 
 * import { useAppSettings } from '@/contexts/AppSettingsContext';
 * 
 * function MyComponent() {
 *   const { theme, largeText, setTheme } = useAppSettings();
 *   
 *   return (
 *     <Text style={{ fontSize: largeText ? 20 : 16 }}>
 *       Hola
 *     </Text>
 *   );
 * }
 * 
 * DÓNDE SE MODIFICA:
 * Las configuraciones se modifican principalmente en:
 * - app/profile.tsx (tabs de Ajustes y Accesibilidad)
 * 
 * DÓNDE SE USA:
 * Prácticamente todas las pantallas de la app usan este contexto para
 * adaptar su apariencia y comportamiento según las preferencias del usuario.
 * 
 * PERSISTENCIA:
 * IMPORTANTE: Actualmente las configuraciones NO se persisten. Al cerrar
 * la app, vuelven a sus valores por defecto. Para persistir, se debe
 * integrar con AsyncStorage o el backend.
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Tipo para el modo de tema (oscuro o claro)
type ThemeMode = 'dark' | 'light';

// Tipo para el contexto completo con todas las configuraciones
type AppSettings = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  easyReading: boolean;
  setEasyReading: (value: boolean) => void;
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  textScale: number;
  setTextScale: (value: number) => void;
  haptics: boolean;
  setHaptics: (value: boolean) => void;
  noBorders: boolean;
  setNoBorders: (value: boolean) => void;
};

// Crear el contexto (inicialmente undefined)
const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

/**
 * Provider que envuelve la app y proporciona las configuraciones
 * Se usa en app/_layout.tsx para envolver toda la aplicación
 */
export function AppSettingsProvider({ children }: { children: ReactNode }) {
  // ========== ESTADOS DE CONFIGURACIÓN ==========
  
  // Tema: oscuro por defecto
  const [theme, setTheme] = useState<ThemeMode>('dark');
  
  // Alto contraste: activado por defecto (mejor accesibilidad)
  const [highContrast, setHighContrast] = useState(true);
  
  // Lectura fácil: desactivado por defecto
  const [easyReading, setEasyReading] = useState(false);
  
  // Texto grande: desactivado por defecto
  const [largeText, setLargeText] = useState(false);
  
  // Escala de texto: 1.0 = normal, 0.8 = pequeño, 1.2 = grande, etc.
  const [textScale, setTextScale] = useState(1.0);
  
  // Hápticos: activado por defecto
  const [haptics, setHaptics] = useState(true);
  
  // Sin bordes: desactivado por defecto
  const [noBorders, setNoBorders] = useState(false);

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        setTheme,
        highContrast,
        setHighContrast,
        easyReading,
        setEasyReading,
        largeText,
        setLargeText,
        textScale,
        setTextScale,
        haptics,
        setHaptics,
        noBorders,
        setNoBorders,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

/**
 * Hook personalizado para acceder a las configuraciones
 * Lanza error si se usa fuera del Provider
 */
export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return ctx;
}
