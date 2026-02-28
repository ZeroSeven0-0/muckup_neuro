# mi-app-supabase

Aplicación de aprendizaje profesional con videos y podcasts integrados. Funciona en iOS, Android y web con Expo + React Native.

## Características principales

- Sistema de cursos modulares con seguimiento de progreso
- Reproductor multimedia integrado (YouTube, Spotify, archivos directos)
- Sistema de logros y gamificación
- Agendamiento de sesiones 1:1 con coaches
- Accesibilidad completa con 6 opciones configurables
- Diseño grayscale minimalista con soporte de tema claro/oscuro

## Stack tecnológico

- **Framework**: Expo + React Native + TypeScript
- **Navegación**: Expo Router (file-based routing)
- **Reproducción de medios**:
  - Video nativo: `expo-av`
  - Embeds (YouTube/Spotify): `react-native-webview`
- **Estado global**: React Context API
  - AppSettingsContext (tema y accesibilidad)
  - CoursesContext (cursos y progreso)
  - SessionsContext (sesiones de coaching)
- **Iconos**: @expo/vector-icons (Ionicons)

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Ejecutar en plataformas específicas
npm run android
npm run ios
npm run web

# Linting
npm run lint
```

## Arquitectura del proyecto

```
app/
├── (tabs)/              # Navegación principal con tabs
│   ├── index.tsx        # Dashboard (Inicio)
│   ├── explore.tsx      # Mi Ruta (lista de cursos)
│   ├── agenda.tsx       # Agenda (sesiones 1:1)
│   └── _layout.tsx      # Configuración de tabs
├── course/
│   └── [id].tsx         # Detalle de curso con lista de lecciones
├── player/
│   └── [lessonId].tsx   # Reproductor multimedia integrado
├── achievements.tsx     # Pantalla de logros (standalone)
├── profile.tsx          # Perfil con 4 tabs (Ajustes, Accesibilidad, Logros, Denuncias)
├── sessions.tsx         # Agendamiento de sesiones
├── index.tsx            # Pantalla de login/entrada
└── _layout.tsx          # Layout raíz con providers

contexts/
├── AppSettingsContext.tsx    # Tema y opciones de accesibilidad
├── CoursesContext.tsx        # Cursos, módulos, lecciones y progreso
└── SessionsContext.tsx       # Sesiones de coaching

components/
├── ui/                  # Componentes UI reutilizables
└── ...                  # Componentes específicos

constants/
├── b2c-mock.ts         # Datos mock (logros, etc.)
└── theme.ts            # Colores y estilos del tema
```

## Sistema de colores (Grayscale)

La aplicación usa un esquema de colores grayscale consistente:

### Color principal (ACCENT)
- `#6B7280` (gris medio) - usado para botones, bordes activos, progreso

### Modo oscuro (dark)
- Background: `#000000`
- Texto principal: `#FFFFFF`
- Texto secundario: `#C7C9E8`
- Tarjetas: `rgba(255, 255, 255, 0.05)` con borde `rgba(255, 255, 255, 0.15)`

### Modo claro (light)
- Background: `#FFFFFF`
- Texto principal: `#0F172A`
- Texto secundario: `#64748B` / `#4B5563`
- Tarjetas: `rgba(255,255,255,0.75)` con borde `rgba(0, 0, 0, 0.15)`

## Sistema de accesibilidad

La app incluye 6 opciones de accesibilidad configurables desde el perfil:

### 1. Tema (theme)
- **Valores**: `'dark'` | `'light'`
- **Efecto**: Cambia colores de fondo, texto y componentes
- **Ubicación**: Perfil → Ajustes

### 2. Alto contraste (highContrast)
- **Efecto**: Aumenta contraste de bordes y elementos interactivos
- **Implementación**: Aplica color ACCENT a bordes de tarjetas y botones
- **Ubicación**: Perfil → Accesibilidad

### 3. Lectura fácil (easyReading)
- **Efecto**: Simplifica textos largos a versiones cortas y directas
- **Implementación**: Cada pantalla tiene dos versiones de texto:
  - Normal: Descripciones completas y detalladas
  - EasyReading: Versiones simplificadas y concisas
- **Ejemplo**:
  - Normal: "Avanza módulo a módulo a tu propio ritmo. Todo el contenido está diseñado para que aprendas de forma progresiva y sin presiones."
  - EasyReading: "Avanza a tu ritmo."
- **Ubicación**: Perfil → Accesibilidad

### 4. Texto grande (largeText)
- **Efecto**: Aumenta tamaño de fuente en toda la app
- **Implementación**: Aplica estilos condicionales con fontSize aumentado
- **Ubicación**: Perfil → Accesibilidad

### 5. Feedback háptico (haptics)
- **Efecto**: Activa vibraciones al completar acciones clave
- **Ubicación**: Perfil → Accesibilidad

### 6. Sin bordes (noBorders)
- **Efecto**: Elimina todos los bordes de tarjetas y contenedores
- **Implementación**: Aplica `borderWidth: 0` y `backgroundColor: 'transparent'`
- **Alcance**: Funciona en TODAS las pantallas y TODOS los elementos con borde
- **Ubicación**: Perfil → Accesibilidad

## Pantallas principales

### 1. Dashboard (Inicio)
**Archivo**: `app/(tabs)/index.tsx`

**Contenido**:
- Saludo personalizado con avatar
- Accesos rápidos (Mi Ruta, Agendar Sesión)
- Progreso general con círculo de porcentaje
- Tarjeta "Continúa donde lo dejaste" con siguiente módulo
- Sección de logros (4 badges visibles)
- Próximas sesiones confirmadas
- FAB de asistente IA (placeholder)

**Características**:
- Cálculo dinámico de progreso basado en lecciones completadas
- Sistema de logros con 11 badges desbloqueables
- Navegación directa a perfil (tab Logros) desde "Ver todos"
- Soporte completo de easyReading y noBorders

### 2. Mi Ruta (Explore)
**Archivo**: `app/(tabs)/explore.tsx`

**Contenido**:
- Lista de módulos/cursos disponibles
- Tarjetas con:
  - Título y descripción del módulo
  - Pills de contenido (Videos, Podcasts)
  - Barra de progreso con porcentaje
  - Siguiente lección pendiente
  - Botón "Ver lecciones"

**Características**:
- Progreso por módulo calculado dinámicamente
- Mensaje de completado cuando módulo está 100%
- Navegación a detalle de curso

### 3. Detalle de curso
**Archivo**: `app/course/[id].tsx`

**Contenido**:
- Header con título del módulo
- Barra de progreso global del módulo
- Lista de lecciones con:
  - Icono de tipo (video/podcast)
  - Título y metadata (duración, tipo)
  - Resumen de la lección
  - Transcripción (preview)
  - Botones: "Reproducir" y "Marcar completado"
  - Badge "Completado" si ya está hecha

**Características**:
- Actualización en vivo del progreso al completar lecciones
- Mensaje accesible con `accessibilityLiveRegion`
- Botón de completado deshabilitado si ya está completo

### 4. Reproductor
**Archivo**: `app/player/[lessonId].tsx`

**Contenido**:
- Header con botón volver, título y botón Ampliar/Reducir
- Área de reproducción (altura ajustable: 300px compacto, 420px expandido)
- Aviso especial para Spotify con botón "Abrir en Spotify"
- Sección de transcripción desplegable

**Reproducción soportada**:
- **YouTube**: Convierte URLs a embed seguro (`youtube-nocookie.com`)
- **Spotify**: Soporta URLs con prefijo `intl-*` (ej: `intl-es`)
- **Archivos directos**:
  - Video: `.mp4`, `.m3u8`, `.mov` → `expo-av` Video
  - Audio: `.mp3`, `.m4a`, `.aac` → WebView con `<audio>`
- **Fallback**: Si falla embed, muestra botón "Abrir en app externa"

**Características**:
- Detección automática de tipo de contenido
- Manejo de errores con fallback a app externa
- Transcripción completa desplegable
- Botón Ampliar/Reducir para ajustar tamaño del reproductor

### 5. Perfil
**Archivo**: `app/profile.tsx`

**Estructura**: 4 tabs horizontales
1. **Ajustes**: Datos personales (nombre, bio, objetivo, ubicación, LinkedIn) + selector de tema
2. **Accesibilidad**: 5 switches (alto contraste, lectura fácil, texto grande, háptico, sin bordes)
3. **Logros**: Grid completo con los 11 logros, cada uno con:
   - Icono y título
   - Descripción
   - Caja de condición (cómo desbloquearlo)
   - Badge "Obtenido" si está desbloqueado
4. **Denuncias**: Pantalla "Próximamente" con mensaje informativo

**Características**:
- Navegación por URL params (ej: `/profile?tab=achievements`)
- Badge en header con contador de logros desbloqueados
- Formulario de perfil con campos editables
- Tema claro/oscuro con toggle visual

### 6. Logros (standalone)
**Archivo**: `app/achievements.tsx`

**Contenido**:
- Header con botón volver
- Contador de logros desbloqueados
- Grid 2 columnas con todos los logros
- Cada tarjeta muestra: icono, título, descripción, condición, badge "Obtenido"

**Nota**: Esta pantalla es redundante con Perfil → Logros. Se mantiene por compatibilidad pero el flujo principal usa el perfil.

### 7. Sesiones (Agenda)
**Archivo**: `app/sessions.tsx`

**Contenido**:
- Formulario para proponer nueva sesión:
  - Fecha propuesta (texto libre)
  - Hora propuesta (texto libre)
  - Notas opcionales
  - Botón "Enviar propuesta"
- Lista de sesiones con:
  - Icono de calendario
  - Título, fecha y hora
  - Badge de estado (Confirmada/Pendiente)

**Características**:
- Sistema de propuesta libre (usuario propone, coach aprueba)
- Validación de campos requeridos
- Estados visuales diferenciados (verde=confirmada, amarillo=pendiente)

## Sistema de logros

**Archivo de datos**: `constants/b2c-mock.ts`

### Logros disponibles (11 total)

1. **Primer Paso** (`first_step`)
   - Condición: Completar 1 módulo
   - Icono: `rocket`

2. **Neuro-Impulso I** (`neuro_impulso_1`)
   - Condición: Completar 3 lecciones
   - Icono: `flash`

3. **Neuro-Impulso II** (`neuro_impulso_2`)
   - Condición: Completar 2 módulos
   - Icono: `flash`

4. **Neuro-Impulso III** (`neuro_impulso_3`)
   - Condición: Completar todos los módulos
   - Icono: `flash`

5. **Soft Skills Star** (`soft_skills_star`)
   - Condición: Completar 3 lecciones
   - Icono: `star`

6. **Curso Completo** (`course_complete`)
   - Condición: Completar todos los módulos
   - Icono: `trophy`

7. **Interview Ready** (`interview_ready`)
   - Condición: Completar módulo "Entrevistas"
   - Icono: `briefcase`

8-11. **Logros adicionales** (placeholder para expansión futura)

### Cálculo de logros

El cálculo se realiza en tiempo real en cada pantalla que muestra logros:

```typescript
const earnedIds = new Set<string>();
if (completedModules.length >= 1) earnedIds.add('first_step');
if (completedModules.length >= 2) earnedIds.add('neuro_impulso_2');
if (completedModules.length === totalModules && totalModules > 0) {
  earnedIds.add('neuro_impulso_3');
  earnedIds.add('course_complete');
}
if (completedLessonsCount >= 3) {
  earnedIds.add('soft_skills_star');
  earnedIds.add('neuro_impulso_1');
}
const entrevistasModule = modules.find((m) => m.title.toLowerCase().includes('entrevistas'));
if (entrevistasModule && entrevistasModule.lessons.every((l) => l.completed)) {
  earnedIds.add('interview_ready');
}
```

## Sistema de cursos y progreso

**Archivo**: `contexts/CoursesContext.tsx`

### Estructura de datos

```typescript
type Lesson = {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  mediaUrl: string;
  mediaType: 'video' | 'podcast';
  summary: string;
  transcript: string;
};

type Module = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};
```

### Funciones disponibles

- `modules`: Array de módulos con sus lecciones
- `completeLesson(moduleId, lessonId)`: Marca una lección como completada

### Agregar contenido nuevo

Para agregar una lección, edita `INITIAL_MODULES` en `contexts/CoursesContext.tsx`:

```typescript
{
  id: 'm1v5',
  title: 'Nueva lección',
  durationMinutes: 5,
  completed: false,
  mediaUrl: 'https://www.youtube.com/watch?v=XXXXX',
  mediaType: 'video',
  summary: 'Descripción breve de la lección',
  transcript: 'Transcripción completa del contenido...'
}
```

**URLs soportadas**:
- YouTube: `https://www.youtube.com/watch?v=XXXXX` o `https://youtu.be/XXXXX`
- Spotify: `https://open.spotify.com/episode/XXXXX` o `https://open.spotify.com/intl-es/track/XXXXX`
- Archivos directos: URLs que terminen en `.mp4`, `.m3u8`, `.mp3`, `.m4a`

## Sistema de sesiones

**Archivo**: `contexts/SessionsContext.tsx`

### Estructura de datos

```typescript
type Session = {
  id: string;
  title: string;
  dateLabel: string;      // Texto libre (ej: "Jueves 14 de marzo")
  timeLabel: string;      // Texto libre (ej: "18:00h")
  status: 'Confirmada' | 'Pendiente';
  startISO: string;       // ISO 8601 para ordenamiento
  endISO: string;
};
```

### Flujo de agendamiento

1. Usuario propone fecha y hora (texto libre)
2. Sistema crea sesión con status "Pendiente"
3. Coach aprueba → status cambia a "Confirmada" (manual por ahora)
4. Sesiones confirmadas aparecen en Dashboard

## Limitaciones conocidas

### Reproductor de YouTube
- **Error 150/151/153**: El propietario del video deshabilitó la inserción en móviles
- **Solución**: Usar videos que permitan embed o archivos propios (`.mp4`, `.m3u8`)
- **Alternativas**: Vimeo, Mux, Cloudflare Stream, Supabase Storage

### Reproductor de Spotify
- Puede requerir login de Spotify
- Algunos contenidos solo muestran preview de 30 segundos
- **Solución**: Botón "Abrir en Spotify" para usar app nativa

### WebView en web
- Algunos embeds requieren interacción del usuario para iniciar audio/video
- Autoplay puede estar bloqueado por políticas del navegador

## Configuración adicional

### app.json
Define iconos, splash screen y configuración de build:
- Iconos: `assets/images/icon.png`
- Splash: `assets/images/splash-icon.png`
- Iconos Android: `android-icon-*`

### Carpeta .kiro
**IMPORTANTE**: NO eliminar esta carpeta. Contiene:
- Configuración de Kiro IDE
- Specs de desarrollo
- Archivos de steering y hooks

Esta carpeta es parte de la configuración del entorno de desarrollo y no afecta la app en producción.

## Próximos pasos

- [ ] Conectar con backend real (FastAPI/Supabase)
- [ ] Implementar autenticación de usuarios
- [ ] Persistir progreso en base de datos
- [ ] Sistema de notificaciones para sesiones
- [ ] Implementar asistente IA (FAB en dashboard)
- [ ] Agregar más logros y gamificación
- [ ] Sistema de denuncias funcional

## Licencia

Proyecto educativo de ejemplo. Personaliza según tus necesidades.
