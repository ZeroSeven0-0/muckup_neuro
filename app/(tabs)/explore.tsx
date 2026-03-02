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

import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function MiRutaScreen() {
  const router = useRouter();
  // Obtener configuraciones de accesibilidad
  const { theme, textScale, easyReading, noBorders } = useAppSettings();
  // Obtener todos los módulos/cursos
  const { modules } = useCourses();
  
  // Estilos globales
  const commonStyles = getCommonStyles(theme, noBorders);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);

  return (
    <View style={commonStyles.root}>
      <View style={commonStyles.gradient} />
      
      <ScrollView
        style={commonStyles.scrollContainer}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header con logotipo */}
        <View style={commonStyles.topBar}>
          <Image 
            source={theme === 'dark' 
              ? require('@/assets/images/logo.png')
              : require('@/assets/images/logo-light.png')
            }
            style={commonStyles.logo}
            resizeMode="contain"
            accessibilityLabel="Logotipo Neurogestión"
          />
        </View>
        
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
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
            <Text accessibilityRole="header" style={[textStyles.title, { color: colors.text }]}>Mi Ruta</Text>
          </View>
          <Text style={[textStyles.subtitle, { color: colors.sub }]}>
            {easyReading ? 'Avanza a tu ritmo.' : 'Avanza módulo a módulo a tu propio ritmo. Todo el contenido está diseñado para que aprendas de forma progresiva y sin presiones.'}
          </Text>
        </View>
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
              style={[commonStyles.card, noBorders && commonStyles.cardNoBorder]}
            >
              <Text style={[styles.moduleTitle, { color: colors.text, fontSize: 16 * textScale }]}>{module.title}</Text>
              <Text style={[styles.moduleDescription, { color: colors.sub, fontSize: 13 * textScale }]}>
                {easyReading ? `${module.title} · ${progressPercent}%` : module.description}
              </Text>

              <View style={styles.mediaRow}>
                <View style={commonStyles.mediaPill}>
                  <Ionicons
                    name="videocam"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginRight: 4 }}
                    accessible={false}
                    importantForAccessibility="no"
                  />
                  <Text style={[textStyles.pillText, { color: '#FFFFFF' }]}>
                    Videos · {videoCount}
                  </Text>
                </View>
                <View style={commonStyles.mediaPill}>
                  <Ionicons
                    name="mic"
                    size={14}
                    color="#FFFFFF"
                    style={{ marginRight: 4 }}
                    accessible={false}
                    importantForAccessibility="no"
                  />
                  <Text style={[textStyles.pillText, { color: '#FFFFFF' }]}>
                    Podcasts · {podcastCount}
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View
                  style={commonStyles.progressBarBackground}
                  accessible
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: 100, now: progressPercent }}
                  accessibilityLabel="Progreso del curso"
                >
                  <View
                    style={[
                      commonStyles.progressBarFill,
                      { width: `${progressPercent}%` },
                    ]}
                  />
                </View>
                <Text style={[textStyles.smallText, { color: colors.text }]}>
                  {progressPercent}% completado
                </Text>
              </View>

              {nextLesson ? (
                <View style={styles.nextLessonRow}>
                  <View>
                    <Text style={[textStyles.smallText, { color: colors.text }]}>
                      Siguiente lección
                    </Text>
                    <Text style={[textStyles.bodyText, { color: colors.text, fontWeight: '500' }]}>{nextLesson.title}</Text>
                    <Text style={[textStyles.smallText, { color: colors.text, marginTop: 2 }]}>
                      {easyReading 
                        ? `${nextLesson.durationMinutes} minutos` 
                        : `Aproximadamente ${nextLesson.durationMinutes} minutos · ${nextLesson.mediaType === 'video' ? 'Video corto y directo' : 'Podcast corto y práctico'} para tu aprendizaje.`}
                    </Text>
                  </View>
                  {/* Botón de acceso único a la lista de lecciones */}
                </View>
              ) : (
                <Text style={[textStyles.secondaryText, { color: colors.text, marginTop: 8 }]}>
                  {easyReading 
                    ? '¡Módulo completado!' 
                    : '¡Felicidades! Has completado este módulo. Revisa tus logros desbloqueados en el panel de progreso del inicio.'}
                </Text>
              )}
              <Pressable
                style={[
                  commonStyles.secondaryButton, 
                  noBorders && commonStyles.secondaryButtonNoBorder,
                  { marginTop: 8 }
                ]}
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
                <Text style={[textStyles.buttonText, { color: colors.text }]}>
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
  header: {
    paddingTop: 8,
  },
  moduleTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleDescription: {
    marginBottom: 8,
  },
  mediaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  nextLessonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
});
