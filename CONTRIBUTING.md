# Guía para Contribuidores

Esta guía te ayudará a entender la estructura del código y cómo contribuir al proyecto.

## 📚 Estructura de Comentarios

Todos los archivos principales del proyecto tienen comentarios detallados que explican:

### 1. Header de Archivo
Cada archivo comienza con un bloque de comentarios que explica:
- **Ubicación**: Ruta del archivo en el proyecto
- **Ruta**: URL de la pantalla (si aplica)
- **Propósito**: Qué hace este archivo
- **Secciones**: Partes principales de la pantalla
- **Navegación**: Cómo se navega desde/hacia esta pantalla
- **Accesibilidad**: Características de accesibilidad implementadas
- **Integración con Backend**: Qué endpoints necesitará en el futuro

Ejemplo:
```typescript
/**
 * ============================================================================
 * DASHBOARD SCREEN (PANTALLA PRINCIPAL / INICIO)
 * ============================================================================
 * 
 * UBICACIÓN: app/(tabs)/index.tsx
 * RUTA: /(tabs)/ (pantalla principal del tab "Inicio")
 * 
 * PROPÓSITO:
 * Pantalla principal de la app que muestra un resumen completo del progreso
 * del usuario, accesos rápidos, próximo módulo, logros desbloqueados y
 * sesiones agendadas.
 * ...
 */
```

### 2. Comentarios de Sección
Dentro de cada archivo, las secciones importantes están marcadas con:
```typescript
// ========== NOMBRE DE LA SECCIÓN ==========
```

Ejemplo:
```typescript
// ========== HOOKS Y CONTEXTOS ==========
const router = useRouter();
const { theme, textScale } = useAppSettings();

// ========== CÁLCULOS DE PROGRESO ==========
const totalModules = modules.length;
const completedModules = modules.filter(...);
```

### 3. Comentarios de Función
Cada función importante tiene un comentario que explica:
- Qué hace la función
- Qué parámetros recibe
- Qué retorna
- Notas especiales (TODO, IMPORTANTE, etc.)

Ejemplo:
```typescript
/**
 * Maneja el inicio de sesión
 * TODO: Conectar con FastAPI/Supabase para autenticación real
 * 
 * FLUJO FUTURO:
 * 1. Validar que email y password no estén vacíos
 * 2. Hacer POST a /api/auth/login con { email, password }
 * 3. Si respuesta es exitosa:
 *    - Guardar token JWT en AsyncStorage
 *    - Navegar a /(tabs)
 * 4. Si respuesta es error:
 *    - Mostrar mensaje de error
 */
const handleLogin = () => {
  // Implementación...
};
```

### 4. Comentarios Inline
Comentarios breves que explican líneas específicas:
```typescript
// Buscar el primer módulo que tenga lecciones pendientes
const nextModuleIndex = modules.findIndex((m) => m.lessons.some((l) => !l.completed));

// Número de orden del siguiente módulo (1-indexed)
const nextModuleOrder = nextModuleIndex >= 0 ? nextModuleIndex + 1 : 0;
```

## 🗂️ Archivos Clave para Entender

### Para Empezar
1. **README.md** - Visión general del proyecto
2. **app/_layout.tsx** - Punto de entrada, configuración de providers
3. **constants/globalStyles.ts** - Sistema de estilos compartidos

### Contextos (Estado Global)
4. **contexts/AppSettingsContext.tsx** - Configuración de accesibilidad
5. **contexts/CoursesContext.tsx** - Cursos y progreso
6. **contexts/SessionsContext.tsx** - Sesiones de coaching

### Pantallas Principales
7. **app/(tabs)/index.tsx** - Dashboard (inicio)
8. **app/(tabs)/explore.tsx** - Mi Ruta (lista de cursos)
9. **app/course/[id].tsx** - Detalle de curso
10. **app/player/[lessonId].tsx** - Reproductor

## 🎯 Cómo Agregar una Nueva Pantalla

### 1. Crear el Archivo
```bash
# Para pantalla con tab
app/(tabs)/nueva-pantalla.tsx

# Para pantalla independiente
app/nueva-pantalla.tsx

# Para pantalla dinámica
app/categoria/[id].tsx
```

### 2. Estructura Básica
```typescript
/**
 * ============================================================================
 * NOMBRE DE LA PANTALLA
 * ============================================================================
 * Ubicación: app/ruta/archivo.tsx
 * Ruta: /ruta (descripción)
 * 
 * PROPÓSITO:
 * Explicación de qué hace esta pantalla
 * 
 * SECCIONES:
 * 1. Primera sección
 * 2. Segunda sección
 * 
 * NAVEGACIÓN:
 * - Desde: Pantalla anterior
 * - Hacia: Pantallas siguientes
 * 
 * ACCESIBILIDAD:
 * - Características implementadas
 */

import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NuevaPantallaScreen() {
  // ========== HOOKS Y CONTEXTOS ==========
  const router = useRouter();
  const { theme, textScale, easyReading, noBorders } = useAppSettings();
  
  // Estilos globales
  const commonStyles = getCommonStyles(theme, noBorders);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);

  // ========== ESTADOS LOCALES ==========
  // Tus estados aquí

  // ========== FUNCIONES ==========
  // Tus funciones aquí

  return (
    <View style={[commonStyles.root, { backgroundColor: colors.bg }]}>
      <ScrollView 
        style={commonStyles.scrollContainer}
        contentContainerStyle={commonStyles.scrollContent}
      >
        {/* Tu contenido aquí */}
        <Text style={[textStyles.title, { color: colors.text }]}>
          Nueva Pantalla
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos específicos de esta pantalla
});
```

### 3. Agregar al Tab (si aplica)
Edita `app/(tabs)/_layout.tsx`:
```typescript
<Tabs.Screen
  name="nueva-pantalla"
  options={{
    title: 'Título',
    tabBarIcon: ({ color }) => <Ionicons name="icon-name" size={24} color={color} />,
  }}
/>
```

## 🎨 Guía de Estilos

### Usar Estilos Globales
```typescript
// ✅ CORRECTO - Usar estilos globales
const commonStyles = getCommonStyles(theme, noBorders);
<View style={commonStyles.card}>

// ❌ INCORRECTO - Duplicar estilos
<View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
```

### Aplicar textScale
```typescript
// ✅ CORRECTO - Multiplicar por textScale
<Text style={{ fontSize: 16 * textScale }}>

// ❌ INCORRECTO - Tamaño fijo
<Text style={{ fontSize: 16 }}>
```

### Soportar easyReading
```typescript
// ✅ CORRECTO - Dos versiones de texto
<Text>
  {easyReading 
    ? 'Texto corto.' 
    : 'Texto largo con más detalles y explicaciones completas.'}
</Text>

// ❌ INCORRECTO - Solo una versión
<Text>Texto largo con más detalles y explicaciones completas.</Text>
```

### Soportar noBorders
```typescript
// ✅ CORRECTO - Aplicar estilo condicional
<View style={[styles.card, noBorders && styles.cardNoBorder]}>

// Definir estilo noBorder
cardNoBorder: {
  borderWidth: 0,
  backgroundColor: 'transparent',
}
```

## ♿ Checklist de Accesibilidad

Al crear una nueva pantalla, asegúrate de:

- [ ] Todos los botones tienen `accessibilityRole="button"`
- [ ] Todos los botones tienen `accessibilityLabel` descriptivo
- [ ] Los títulos tienen `accessibilityRole="header"`
- [ ] Los inputs tienen `minHeight: 44` (tamaño mínimo táctil)
- [ ] Los elementos interactivos tienen `hitSlop={8}` si son pequeños
- [ ] Los cambios dinámicos usan `accessibilityLiveRegion="polite"`
- [ ] Los textos se multiplican por `textScale`
- [ ] Hay versión `easyReading` de textos largos
- [ ] Los estilos respetan `noBorders`
- [ ] Los colores vienen de `getThemeColors(theme)`

## 🔧 Agregar Nueva Funcionalidad

### 1. Agregar Nuevo Curso
Edita `contexts/CoursesContext.tsx`:
```typescript
const INITIAL_MODULES: Module[] = [
  // ... cursos existentes
  {
    id: 'm5',
    title: 'Curso 5 · Nuevo Tema',
    description: 'Descripción del curso',
    lessons: [
      {
        id: 'm5v1',
        title: 'Primera lección',
        durationMinutes: 3,
        completed: false,
        mediaUrl: 'https://youtube.com/watch?v=...',
        mediaType: 'video',
        summary: 'Resumen corto',
        transcript: 'Transcripción completa...',
      },
    ],
  },
];
```

### 2. Agregar Nuevo Logro
Edita `constants/b2c-mock.ts`:
```typescript
export const ACHIEVEMENTS = [
  // ... logros existentes
  {
    id: 'nuevo_logro',
    icon: 'star',
    title: 'Título del Logro',
    description: 'Descripción corta',
    condition: 'Cómo desbloquearlo',
  },
];
```

Luego actualiza `utils/achievements.ts` para calcular cuándo se desbloquea.

### 3. Agregar Nueva Configuración de Accesibilidad
1. Agrega el estado en `contexts/AppSettingsContext.tsx`
2. Agrega el switch en `app/profile.tsx` (tab Accesibilidad)
3. Aplica la configuración en las pantallas que la necesiten

## 🐛 Debugging

### Ver Contextos
```typescript
// Agregar console.log temporal
const { modules } = useCourses();
console.log('Módulos:', modules);
```

### Ver Estilos Aplicados
```typescript
// Agregar border temporal para ver el elemento
<View style={[styles.card, { borderWidth: 2, borderColor: 'red' }]}>
```

### Verificar Accesibilidad
1. Activar lector de pantalla en tu dispositivo
2. Navegar por la app con gestos de accesibilidad
3. Verificar que los labels sean descriptivos

## 📝 Convenciones de Código

### Nombres de Variables
- **Componentes**: PascalCase (`DashboardScreen`)
- **Funciones**: camelCase (`handleLogin`)
- **Constantes**: UPPER_SNAKE_CASE (`ACCENT`, `INITIAL_MODULES`)
- **Tipos**: PascalCase (`Module`, `Lesson`)

### Orden de Imports
```typescript
// 1. React y librerías externas
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. Librerías de terceros
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 3. Imports locales (@ alias)
import { getCommonStyles } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
```

### Orden de Código en Componentes
```typescript
export default function MiComponente() {
  // 1. Hooks de navegación
  const router = useRouter();
  
  // 2. Hooks de contexto
  const { theme } = useAppSettings();
  
  // 3. Estados locales
  const [count, setCount] = useState(0);
  
  // 4. Estilos globales
  const colors = getThemeColors(theme);
  
  // 5. Cálculos y efectos
  const total = count * 2;
  
  // 6. Funciones
  const handleClick = () => {};
  
  // 7. Render
  return <View>...</View>;
}

// 8. Estilos locales
const styles = StyleSheet.create({});
```

## 🚀 Testing (Futuro)

Cuando se implementen tests:
- Unit tests para funciones puras (cálculo de logros, etc.)
- Integration tests para contextos
- E2E tests para flujos críticos (login, completar lección)
- Accessibility tests con @testing-library/react-native

## 📞 Ayuda

Si tienes dudas:
1. Lee los comentarios en el archivo relevante
2. Busca ejemplos similares en otros archivos
3. Consulta el README.md
4. Pregunta al equipo

## ✅ Checklist antes de Commit

- [ ] Código comentado según las convenciones
- [ ] Estilos globales usados donde sea posible
- [ ] Accesibilidad implementada (labels, roles, hitSlop)
- [ ] textScale aplicado a todos los textos
- [ ] easyReading soportado en textos largos
- [ ] noBorders soportado en elementos con borde
- [ ] Sin console.log en código final
- [ ] Sin variables sin usar
- [ ] Diagnostics pasan sin errores

---

¡Gracias por contribuir! 🎉
