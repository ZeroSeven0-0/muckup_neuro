/**
 * ============================================================================
 * MI RUTA SCREEN (PANTALLA DE CURSOS)
 * ============================================================================
 * Ubicación: app/(tabs)/explore.tsx
 * Ruta: /(tabs)/explore (segunda tab del menú inferior)
 * 
 * PROPÓSITO:
 * Esta pantalla muestra todos los módulos/cursos disponibles en la app.
 * Permite al usuario ver su progreso en cada curso y acceder a las lecciones.
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con título "Mi Ruta" y botón de volver
 * 2. Subtítulo explicativo sobre el aprendizaje progresivo
 * 3. Lista de tarjetas de módulos, cada una muestra:
 *    - Título y descripción del módulo
 *    - Contadores de videos y podcasts
 *    - Barra de progreso con porcentaje
 *    - Siguiente lección pendiente (si hay)
 *    - Botón "Ver lecciones" para ir al detalle
 * 
 * CÁLCULOS POR MÓDULO:
 * - nextLesson: Primera lección no completada del módulo
 * - completedCount: Cantidad de lecciones completadas
 * - progressPercent: Porcentaje de lecciones completadas (0-100)
 * - videoCount: Cantidad de lecciones tipo 'video'
 * - podcastCount: Cantidad de lecciones tipo 'podcast'
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a la pantalla anterior o al dashboard
 * - Botón "Ver lecciones" → /course/[id] (detalle del módulo)
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta theme dark/light
 * - Barra de progreso con accessibilityRole="progressbar"
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - modules vendrá de la API (ya está en CoursesContext)
 * - El progreso se sincronizará con el backend al completar lecciones
 * ============================================================================
 */

import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function MiRutaScreen() {
  const router = useRouter();
  // Obtener configuraciones de accesibilidad
  const { theme, largeText, easyReading, noBorders } = useAppSettings();
  // Obtener todos los módulos/cursos
  const { modules } = useCourses();
  
  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#4B5563';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <View style={styles.header} accessibilityLabel="Pantalla Mi Ruta de aprendizaje">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Pressable
            onPress={() => {
              if (typeof router.canGoBack === 'function' && router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={{ marginRight: 8 }}
          >
            <Ionicons name="chevron-back" size={18} color={text} />
          </Pressable>
          <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && { fontSize: 24 }]}>Mi Ruta</Text>
        </View>
        <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 16 }]}>
          {easyReading ? 'Avanza a tu ritmo.' : 'Avanza módulo a módulo a tu propio ritmo. Todo el contenido está diseñado para que aprendas de forma progresiva y sin presiones.'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mapear cada módulo y mostrar su tarjeta */}
        {modules.map((module) => {
          // ========== CÁLCULOS POR MÓDULO ==========
          // Buscar la primera lección no completada
          const nextLesson = module.lessons.find((l) => !l.completed);
          // Contar lecciones completadas
          const completedCount = module.lessons.filter((lesson) => lesson.completed).length;
          // Calcular porcentaje de progreso
          const progressPercent = module.lessons.length
            ? Math.round((completedCount / module.lessons.length) * 100)
            : 0;
          // Contar videos y podcasts
          const videoCount = module.lessons.filter((lesson) => lesson.mediaType === 'video').length;
          const podcastCount = module.lessons.filter((lesson) => lesson.mediaType === 'podcast').length;

          return (
            <View
              key={module.id}
              style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}
            >
              <Text style={[styles.moduleTitle, { color: text }, largeText && { fontSize: 18 }]}>{module.title}</Text>
              <Text style={[styles.moduleDescription, { color: sub }, largeText && { fontSize: 14 }]}>
                {easyReading ? `${module.title} · ${progressPercent}%` : module.description}
              </Text>

              <View style={styles.mediaRow}>
                <View style={styles.mediaPill}>
                  <Ionicons
                    name="videocam"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginRight: 4 }}
                    accessible={false}
                    importantForAccessibility="no"
                  />
                  <Text style={styles.mediaText}>
                    Videos · {videoCount}
                  </Text>
                </View>
                <View style={styles.mediaPill}>
                  <Ionicons
                    name="mic"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginRight: 4 }}
                    accessible={false}
                    importantForAccessibility="no"
                  />
                  <Text style={styles.mediaText}>
                    Podcasts · {podcastCount}
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View
                  style={styles.progressBarBackground}
                  accessible
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: 100, now: progressPercent }}
                  accessibilityLabel="Progreso del curso"
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${progressPercent}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: text }, largeText && { fontSize: 12 }]}>
                  {progressPercent}% completado
                </Text>
              </View>

              {nextLesson ? (
                <View style={styles.nextLessonRow}>
                  <View>
                    <Text style={[styles.nextLabel, { color: text }, largeText && { fontSize: 12 }]}>
                      Siguiente lección
                    </Text>
                    <Text style={[styles.nextTitle, { color: text }, largeText && { fontSize: 16 }]}>{nextLesson.title}</Text>
                    <Text style={[styles.nextMeta, { color: text }, largeText && { fontSize: 12 }]}>
                      {easyReading 
                        ? `${nextLesson.durationMinutes} minutos` 
                        : `Aproximadamente ${nextLesson.durationMinutes} minutos · ${nextLesson.mediaType === 'video' ? 'Video corto y directo' : 'Podcast corto y práctico'} para tu aprendizaje.`}
                    </Text>
                  </View>
                  {/* Botón de acceso único a la lista de lecciones */}
                </View>
              ) : (
                <Text style={[styles.completedText, { color: text }, largeText && { fontSize: 13 }]}>
                  {easyReading 
                    ? '¡Módulo completado!' 
                    : '¡Felicidades! Has completado este módulo. Revisa tus logros desbloqueados en el panel de progreso del inicio.'}
                </Text>
              )}
              <Pressable
                style={[styles.secondaryPill, noBorders && styles.secondaryPillNoBorder]}
                accessibilityRole="button"
                accessibilityLabel={`Abrir lista de lecciones de ${module.title}`}
                accessibilityHint="Abre la lista completa de lecciones con transcripción."
                onPress={() =>
                  router.push({
                    pathname: '/course/[id]',
                    params: { id: module.id },
                  })
                }
              >
                <Text style={[styles.secondaryPillText, { color: text }, largeText && { fontSize: 14 }]}>
                  Ver lecciones
                </Text>
              </Pressable>
            </View>
          );
        })}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
  },
  cardLight: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  cardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  moduleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    color: '#C7C9E8',
    fontSize: 13,
    marginBottom: 8,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  mediaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  mediaText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(107, 114, 128, 0.25)',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  progressText: {
    color: '#C7C9E8',
    fontSize: 11,
  },
  nextLessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  nextLabel: {
    color: '#C7C9E8',
    fontSize: 11,
  },
  nextTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  nextMeta: {
    color: '#C7C9E8',
    fontSize: 11,
    marginTop: 2,
  },
  primaryPill: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryPillText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 13,
  },
  secondaryPill: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryPillNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  secondaryPillText: {
    fontWeight: '600',
    fontSize: 13,
  },
  completedText: {
    color: '#C7C9E8',
    fontSize: 12,
    marginTop: 8,
  },
});
