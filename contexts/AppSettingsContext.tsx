/**
 * ============================================================================
 * CONTEXTO DE CONFIGURACIÓN DE LA APP (AppSettingsContext)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este archivo maneja todas las configuraciones de accesibilidad y preferencias
 * visuales de la aplicación. Es el "cerebro" que controla cómo se ve la app.
 * 
 * UBICACIÓN EN EL PROYECTO:
 * contexts/AppSettingsContext.tsx
 * 
 * USADO EN:
 * - Todas las pantallas de la app (Dashboard, Mi Ruta, Perfil, etc.)
 * - Se importa con: import { useAppSettings } from '@/contexts/AppSettingsContext'
 * 
 * ============================================================================
 */

import React, { createContext, useContext, useState, type ReactNode } from 'react';

// ============================================================================
// TIPOS DE DATOS
// ============================================================================

/**
 * ThemeMode: Define los temas disponibles
 * - 'dark': Modo oscuro (fondo negro, texto blanco)
 * - 'light': Modo claro (fondo blanco, texto negro)
 */
type ThemeMode = 'dark' | 'light';

/**
 * AppSettings: Todas las configuraciones disponibles en la app
 * Cada configuración tiene un valor (boolean o string) y una función para cambiarlo
 */
type AppSettings = {
  // TEMA: Controla si la app está en modo oscuro o claro
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  
  // ALTO CONTRASTE: Aumenta el contraste de bordes y elementos
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  
  // LECTURA FÁCIL: Simplifica textos largos a versiones cortas
  easyReading: boolean;
  setEasyReading: (value: boolean) => void;
  
  // TEXTO GRANDE: Aumenta el tamaño de fuente en toda la app
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  
  // HÁPTICO: Activa vibraciones al completar acciones
  haptics: boolean;
  setHaptics: (value: boolean) => void;
  
  // SIN BORDES: Elimina bordes de tarjetas y contenedores
  noBorders: boolean;
  setNoBorders: (value: boolean) => void;
};

// ============================================================================
// CONTEXTO
// ============================================================================

/**
 * Crea el contexto de React para compartir configuraciones en toda la app
 * Inicialmente es undefined hasta que se envuelve con el Provider
 */
const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

// ============================================================================
// PROVIDER (Proveedor de configuraciones)
// ============================================================================

/**
 * AppSettingsProvider: Componente que envuelve toda la app
 * 
 * CÓMO FUNCIONA:
 * 1. Guarda todas las configuraciones en estados (useState)
 * 2. Proporciona las configuraciones a todos los componentes hijos
 * 3. Cualquier componente puede leer o cambiar estas configuraciones
 * 
 * DÓNDE SE USA:
 * En app/_layout.tsx envuelve toda la aplicación
 * 
 * VALORES POR DEFECTO:
 * - theme: 'dark' (modo oscuro activado)
 * - highContrast: true (alto contraste activado)
 * - easyReading: false (lectura fácil desactivada)
 * - largeText: false (texto grande desactivado)
 * - haptics: true (vibraciones activadas)
 * - noBorders: false (bordes visibles)
 */
export function AppSettingsProvider({ children }: { children: ReactNode }) {
  // Estados para cada configuración
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [highContrast, setHighContrast] = useState(true);
  
  // Por defecto mostramos contenido completo (no "lectura fácil") 
  // para evitar textos demasiado cortos
  const [easyReading, setEasyReading] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [haptics, setHaptics] = useState(true);
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

// ============================================================================
// HOOK PERSONALIZADO (useAppSettings)
// ============================================================================

/**
 * useAppSettings: Hook para usar las configuraciones en cualquier componente
 * 
 * CÓMO USARLO:
 * ```typescript
 * import { useAppSettings } from '@/contexts/AppSettingsContext';
 * 
 * function MiComponente() {
 *   const { theme, setTheme, easyReading } = useAppSettings();
 *   
 *   // Leer el tema actual
 *   const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
 *   
 *   // Cambiar el tema
 *   const toggleTheme = () => {
 *     setTheme(theme === 'dark' ? 'light' : 'dark');
 *   };
 *   
 *   return <View style={{ backgroundColor: bg }}>...</View>;
 * }
 * ```
 * 
 * ERROR COMÚN:
 * Si ves el error "useAppSettings must be used within AppSettingsProvider"
 * significa que olvidaste envolver tu app con <AppSettingsProvider>
 */
export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return ctx;
}

// ============================================================================
// NOTAS PARA DESARROLLADORES
// ============================================================================

/**
 * CÓMO AGREGAR UNA NUEVA CONFIGURACIÓN:
 * 
 * 1. Agregar el tipo en AppSettings:
 *    myNewSetting: boolean;
 *    setMyNewSetting: (value: boolean) => void;
 * 
 * 2. Crear el estado en AppSettingsProvider:
 *    const [myNewSetting, setMyNewSetting] = useState(false);
 * 
 * 3. Agregarlo al value del Provider:
 *    value={{
 *      ...
 *      myNewSetting,
 *      setMyNewSetting,
 *    }}
 * 
 * 4. Usarlo en cualquier componente:
 *    const { myNewSetting, setMyNewSetting } = useAppSettings();
 * 
 * CONEXIÓN CON BACKEND (FUTURO):
 * Cuando conectes con el backend, puedes:
 * 1. Cargar configuraciones guardadas del usuario al iniciar
 * 2. Guardar cambios automáticamente cuando el usuario modifica algo
 * 3. Sincronizar entre dispositivos
 */

