# Consistent Theme Colors Bugfix Design

## Overview

Este bugfix estandariza el esquema de colores en 6 pantallas de la aplicación para que coincidan con la implementación correcta de la pantalla de inicio (`app/index.tsx`). El problema principal es que las pantallas afectadas no están aplicando correctamente los colores del modo claro, específicamente:

1. La variable `sub` (color de subtexto) se asigna incorrectamente al mismo valor que `text` en lugar de usar el color específico del tema
2. Los estilos de tarjetas no se adaptan al modo claro (fondo y bordes)
3. Algunos iconos mantienen colores del modo oscuro en lugar de adaptarse al tema claro

La estrategia de corrección es mínima y quirúrgica: actualizar las asignaciones de variables de color y aplicar estilos condicionales para tarjetas en las 6 pantallas afectadas, siguiendo exactamente el patrón de `app/index.tsx`.

## Glossary

- **Bug_Condition (C)**: La condición que activa el bug - cuando el usuario está en modo claro (`theme === 'light'`) y navega a una de las 6 pantallas afectadas
- **Property (P)**: El comportamiento deseado - todas las pantallas deben usar el esquema de colores correcto según el tema activo
- **Preservation**: Los comportamientos existentes del modo oscuro, color de acento, alto contraste, texto grande y lectura fácil que deben permanecer sin cambios
- **AppSettingsContext**: El contexto de React en `contexts/AppSettingsContext.tsx` que proporciona el estado del tema (`theme: 'dark' | 'light'`) y otras preferencias de accesibilidad
- **ACCENT**: La constante de color `#8379CD` usada para botones primarios, enlaces y elementos de énfasis en ambos temas
- **isDark**: Variable booleana derivada de `theme === 'dark'` que determina qué esquema de colores aplicar
- **Pantallas afectadas**: Las 6 pantallas que requieren corrección de colores

## Bug Details

### Fault Condition

El bug se manifiesta cuando el usuario activa el modo claro (`theme === 'light'`) y navega a cualquiera de las 6 pantallas afectadas. Las pantallas no aplican correctamente el esquema de colores del modo claro, resultando en texto con bajo contraste, fondos incorrectos y elementos visuales inconsistentes.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { theme: 'dark' | 'light', currentScreen: string }
  OUTPUT: boolean
  
  RETURN input.theme === 'light'
         AND input.currentScreen IN [
           'app/(tabs)/index.tsx',
           'app/(tabs)/explore.tsx',
           'app/sessions.tsx',
           'app/profile.tsx',
           'app/course/[id].tsx',
           'app/player/[lessonId].tsx'
         ]
         AND NOT colorsMatchLightThemeSpec(input.currentScreen)
END FUNCTION

FUNCTION colorsMatchLightThemeSpec(screen)
  RETURN screen.backgroundColor === '#FFFFFF'
         AND screen.textColor === '#000000'
         AND screen.subtextColor === '#4B5563'
         AND screen.cardStyle === cardLight
END FUNCTION
```

### Examples

- **Dashboard en modo claro**: El usuario activa modo claro y navega a Dashboard. El subtexto usa `#000000` (mismo que texto principal) en lugar de `#4B5563`, reduciendo la jerarquía visual. Las tarjetas mantienen el fondo oscuro `rgba(225, 228, 243, 0.12)` en lugar de usar `rgba(255,255,255,0.75)`.

- **Mi Ruta en modo claro**: El usuario activa modo claro y navega a Mi Ruta. La variable `sub` se asigna incorrectamente como `const sub = text;` en lugar de `const sub = isDark ? '#C7C9E8' : '#4B5563';`. Los módulos de curso muestran texto con contraste inadecuado.

- **Perfil en modo claro**: El usuario activa modo claro y navega a Perfil. Los iconos decorativos usan `ACCENT` (#8379CD) en lugar de `#0F172A`, creando contraste insuficiente con el fondo blanco.

- **Reproductor en modo claro**: El usuario activa modo claro y reproduce una lección. Los controles del reproductor mantienen colores del modo oscuro, haciendo difícil distinguir los botones sobre el fondo blanco.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- El modo oscuro debe continuar funcionando exactamente como está actualmente (fondo #000000, texto #FFFFFF, subtexto #C7C9E8)
- El color de acento ACCENT (#8379CD) debe seguir usándose para botones primarios, enlaces y elementos de énfasis en ambos temas
- El modo alto contraste debe continuar aplicando el estilo `cardHC` con borderColor ACCENT
- Las preferencias de texto grande y lectura fácil deben seguir aplicando sus estilos condicionales
- La navegación entre pantallas debe mantener el estado del tema seleccionado a través del contexto AppSettingsContext
- Los inputs de texto deben continuar usando los colores de borde y fondo que cambian según el tema (inputBg e inputBorder)

**Scope:**
Todas las interacciones que NO involucran el modo claro deben permanecer completamente inalteradas. Esto incluye:
- Cualquier interacción en modo oscuro
- Cambios de tema usando el toggle
- Activación/desactivación de alto contraste, lectura fácil, texto grande
- Navegación entre pantallas
- Reproducción de contenido multimedia
- Interacciones con formularios y botones

## Hypothesized Root Cause

Basado en el análisis del código, las causas más probables son:

1. **Asignación incorrecta de variable `sub`**: En varias pantallas, la variable `sub` se asigna como `const sub = text;` en lugar de usar la lógica condicional correcta `const sub = isDark ? '#C7C9E8' : '#4B5563';`. Esto hace que el subtexto tenga el mismo color que el texto principal, eliminando la jerarquía visual.

2. **Falta de estilos condicionales para tarjetas**: Las tarjetas usan estilos estáticos definidos en StyleSheet que no se adaptan al tema. Aunque existe un estilo `cardLight` definido en algunos archivos, no se aplica condicionalmente cuando `theme === 'light'`.

3. **Colores hardcodeados para iconos**: Algunos iconos usan directamente la constante `ACCENT` o colores del modo oscuro sin verificar el tema actual. En modo claro, deberían usar `#0F172A` para mantener contraste adecuado.

4. **Copia inconsistente del patrón**: Las pantallas fueron creadas copiando código de otras pantallas en lugar de seguir el patrón establecido en `app/index.tsx`, propagando el error a través de múltiples archivos.

## Correctness Properties

Property 1: Fault Condition - Light Theme Colors Applied Correctly

_For any_ user interaction where the theme is set to 'light' and the user navigates to one of the 6 affected screens, the fixed screens SHALL display with background color #FFFFFF, text color #000000, subtext color #4B5563, and card styles using cardLight (backgroundColor 'rgba(255,255,255,0.75)' and borderColor 'rgba(15,23,42,0.12)').

**Validates: Requirements 2.1, 2.2, 2.4, 2.5, 2.6**

Property 2: Preservation - Dark Theme and Other Features Unchanged

_For any_ user interaction where the theme is NOT 'light' (i.e., theme === 'dark'), or any interaction involving high contrast mode, easy reading mode, large text mode, or navigation between screens, the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for dark mode and accessibility features.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Asumiendo que nuestro análisis de causa raíz es correcto:

**Archivos a modificar**: Las 6 pantallas afectadas

**Cambios específicos por archivo**:

1. **Corrección de variable `sub`**: En cada pantalla, cambiar la asignación de la variable `sub` de:
   ```typescript
   const sub = text;
   ```
   a:
   ```typescript
   const sub = isDark ? '#C7C9E8' : '#4B5563';
   ```

2. **Aplicación condicional de estilos de tarjeta**: Para componentes de tarjeta (View con style `styles.card`), agregar aplicación condicional del estilo `cardLight`:
   ```typescript
   style={[styles.card, !isDark && styles.cardLight]}
   ```
   Y asegurar que `cardLight` esté definido en StyleSheet:
   ```typescript
   cardLight: {
     backgroundColor: 'rgba(255,255,255,0.75)',
     borderColor: 'rgba(15,23,42,0.12)',
   }
   ```

3. **Corrección de colores de iconos decorativos**: Para iconos que usan ACCENT en modo claro, cambiar a color condicional:
   ```typescript
   color={isDark ? ACCENT : '#0F172A'}
   ```

4. **Verificación de inputBg e inputBorder**: Confirmar que los inputs de texto usan las variables correctas:
   ```typescript
   const inputBg = isDark ? '#000000' : '#FFFFFF';
   const inputBorder = isDark ? '#FFFFFF' : '#000000';
   ```

5. **Revisión de estilos estáticos**: Identificar y actualizar cualquier color hardcodeado en StyleSheet que deba ser dinámico según el tema.

### Pantallas específicas y sus cambios:

**app/(tabs)/index.tsx (Dashboard)**:
- Corregir `const sub = text;` → `const sub = isDark ? '#C7C9E8' : '#4B5563';`
- Aplicar `cardLight` a tarjetas de estadísticas y módulos recientes
- Verificar colores de iconos en tarjetas

**app/(tabs)/explore.tsx (Mi Ruta)**:
- Corregir `const sub = text;` → `const sub = isDark ? '#C7C9E8' : '#4B5563';`
- Aplicar `cardLight` a tarjetas de módulos
- Asegurar que el estilo `cardLight` esté definido (actualmente existe pero no se usa)

**app/sessions.tsx (Sesiones)**:
- Corregir asignación de variable `sub`
- Aplicar estilos condicionales a tarjetas de sesiones
- Verificar colores de iconos de calendario y reloj

**app/profile.tsx (Perfil)**:
- Corregir asignación de variable `sub`
- Aplicar estilos condicionales a tarjetas de configuración
- Corregir colores de iconos decorativos (usar `#0F172A` en modo claro)

**app/course/[id].tsx (Detalle de curso)**:
- Corregir asignación de variable `sub`
- Aplicar estilos condicionales a tarjetas de lecciones
- Verificar colores de iconos de tipo de media (video/podcast)

**app/player/[lessonId].tsx (Reproductor)**:
- Corregir asignación de variable `sub`
- Aplicar estilos condicionales a controles del reproductor
- Asegurar que los botones de control sean visibles en modo claro

## Testing Strategy

### Validation Approach

La estrategia de testing sigue un enfoque de dos fases: primero, demostrar el bug en el código sin corregir mediante tests exploratorios que capturen el comportamiento incorrecto; luego, verificar que la corrección funciona correctamente y preserva el comportamiento existente del modo oscuro.

### Exploratory Fault Condition Checking

**Goal**: Demostrar el bug ANTES de implementar la corrección. Confirmar o refutar el análisis de causa raíz. Si refutamos, necesitaremos re-hipotetizar.

**Test Plan**: Escribir tests que simulen la activación del modo claro y navegación a cada pantalla afectada, capturando los valores actuales de las variables de color y estilos aplicados. Ejecutar estos tests en el código SIN CORREGIR para observar las fallas y entender la causa raíz.

**Test Cases**:
1. **Dashboard Light Mode Test**: Simular `theme = 'light'` y renderizar Dashboard. Capturar el valor de `sub` (fallará: será '#000000' en lugar de '#4B5563')
2. **Mi Ruta Card Style Test**: Simular `theme = 'light'` y renderizar Mi Ruta. Verificar estilos de tarjetas (fallará: usará estilos de modo oscuro)
3. **Profile Icon Color Test**: Simular `theme = 'light'` y renderizar Perfil. Verificar color de iconos decorativos (fallará: usará ACCENT en lugar de '#0F172A')
4. **Player Controls Visibility Test**: Simular `theme = 'light'` y renderizar Reproductor. Verificar contraste de controles (puede fallar: controles difíciles de ver)

**Expected Counterexamples**:
- La variable `sub` tendrá el mismo valor que `text` en modo claro, eliminando jerarquía visual
- Las tarjetas mantendrán fondos oscuros y bordes del modo oscuro en lugar de adaptarse al modo claro
- Los iconos usarán colores del modo oscuro que tienen bajo contraste con fondo blanco
- Posibles causas confirmadas: asignación incorrecta de variables, falta de estilos condicionales, colores hardcodeados

### Fix Checking

**Goal**: Verificar que para todas las entradas donde la condición del bug se cumple, las pantallas corregidas producen el comportamiento esperado.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := renderScreen_fixed(input.currentScreen, input.theme)
  ASSERT result.backgroundColor === '#FFFFFF'
  ASSERT result.textColor === '#000000'
  ASSERT result.subtextColor === '#4B5563'
  ASSERT result.cardBackgroundColor === 'rgba(255,255,255,0.75)'
  ASSERT result.cardBorderColor === 'rgba(15,23,42,0.12)'
END FOR
```

### Preservation Checking

**Goal**: Verificar que para todas las entradas donde la condición del bug NO se cumple, las pantallas corregidas producen el mismo resultado que las pantallas originales.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT renderScreen_original(input) = renderScreen_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing es recomendado para preservation checking porque:
- Genera muchos casos de prueba automáticamente a través del dominio de entrada
- Captura casos edge que los tests unitarios manuales podrían perder
- Proporciona garantías fuertes de que el comportamiento permanece sin cambios para todas las entradas no afectadas por el bug

**Test Plan**: Observar el comportamiento en código SIN CORREGIR primero para modo oscuro y otras interacciones, luego escribir property-based tests que capturen ese comportamiento.

**Test Cases**:
1. **Dark Mode Preservation**: Observar que todas las pantallas funcionan correctamente en modo oscuro en código sin corregir, luego verificar que esto continúa después de la corrección
2. **High Contrast Preservation**: Observar que el modo alto contraste aplica `cardHC` correctamente en código sin corregir, luego verificar que esto continúa después de la corrección
3. **Navigation Preservation**: Observar que la navegación entre pantallas mantiene el tema en código sin corregir, luego verificar que esto continúa después de la corrección
4. **Accent Color Preservation**: Observar que ACCENT se usa correctamente en botones y enlaces en código sin corregir, luego verificar que esto continúa después de la corrección

### Unit Tests

- Test de asignación de variable `sub` en cada pantalla para ambos temas
- Test de aplicación de estilos de tarjeta (`card` vs `cardLight`) según el tema
- Test de colores de iconos en modo claro vs modo oscuro
- Test de contraste de texto en ambos temas
- Test de visibilidad de controles del reproductor en ambos temas

### Property-Based Tests

- Generar estados aleatorios de tema ('dark' | 'light') y verificar que los colores se aplican correctamente en todas las pantallas
- Generar combinaciones aleatorias de preferencias de accesibilidad (highContrast, largeText, easyReading) y verificar que se preservan después de la corrección
- Generar secuencias aleatorias de navegación entre pantallas y verificar que el tema se mantiene consistente

### Integration Tests

- Test de flujo completo: activar modo claro → navegar a cada pantalla → verificar colores correctos
- Test de cambio de tema: iniciar en modo oscuro → navegar a varias pantallas → cambiar a modo claro → verificar que todas las pantallas actualizan colores
- Test de accesibilidad: activar modo claro + alto contraste + texto grande → verificar que todas las características funcionan juntas correctamente
- Test visual: capturar screenshots de cada pantalla en modo claro y comparar con la referencia de la pantalla de inicio
