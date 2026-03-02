/**
 * ============================================================================
 * ROOT LAYOUT (LAYOUT RAÍZ DE LA APP)
 * ============================================================================
 * Ubicación: app/_layout.tsx
 * 
 * PROPÓSITO:
 * Este es el archivo de configuración principal de la app. Define:
 * 1. Los providers globales (contextos) que envuelven toda la aplicación
 * 2. La estructura de navegación con Expo Router
 * 3. El tema de navegación (dark/light)
 * 4. La configuración de la StatusBar
 * 
 * PROVIDERS GLOBALES (en orden de anidación):
 * 1. AppSettingsProvider - Configuraciones de accesibilidad y tema
 * 2. CoursesProvider - Cursos, módulos y lecciones
 * 3. SessionsProvider - Sesiones de coaching
 * 
 * ESTRUCTURA DE NAVEGACIÓN:
 * - Stack Navigator (navegación por pilas)
 * - Pantalla inicial: index (login)
 * - Pantallas principales: (tabs), sessions, profile, achievements, course, player
 * 
 * CONFIGURACIÓN:
 * - unstable_settings.anchor: Define 'index' como punto de entrada
 * - Todas las pantallas tienen headerShown: false (headers personalizados)
 * 
 * NOTA IMPORTANTE:
 * Este archivo NO debe ser modificado a menos que:
 * - Agregues un nuevo provider global
 * - Agregues una nueva pantalla de nivel raíz
 * - Cambies la pantalla de entrada de la app
 * ============================================================================
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { SessionsProvider } from '@/contexts/SessionsContext';

// Configuración de Expo Router: define 'index' como pantalla de entrada (login)
export const unstable_settings = {
  anchor: 'index',
};

/**
 * Componente raíz que envuelve toda la app con los providers necesarios
 * Los providers se anidan en este orden para que todos los componentes
 * tengan acceso a los contextos globales
 */
export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <CoursesProvider>
        <SessionsProvider>
          <RootNavigator />
        </SessionsProvider>
      </CoursesProvider>
    </AppSettingsProvider>
  );
}

/**
 * Navegador principal de la app
 * Configura el Stack Navigator con todas las pantallas disponibles
 * y aplica el tema según la configuración del usuario
 */
function RootNavigator() {
  // Obtener el tema actual del usuario
  const { theme } = useAppSettings();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Pantalla de login (punto de entrada) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* Navegación por tabs (Dashboard, Mi Ruta, Agenda) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Pantallas independientes */}
        <Stack.Screen name="sessions" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
        
        {/* Pantallas dinámicas (con parámetros en la URL) */}
        <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="player/[lessonId]" options={{ headerShown: false }} />
        
        {/* Modal de ejemplo (no usado actualmente) */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      
      {/* StatusBar: barra de estado del sistema (hora, batería, etc.) */}
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
