/**
 * ============================================================================
 * COURSE DETAIL SCREEN (DETALLE DE CURSO)
 * ============================================================================
 * Ubicación: app/course/[id].tsx
 * Ruta: /course/[id] (pantalla dinámica según ID del módulo)
 * 
 * PROPÓSITO:
 * Esta pantalla muestra el detalle completo de un módulo/curso específico.
 * Lista todas las lecciones del módulo con su información y permite:
 * - Ver resumen y transcripción de cada lección
 * - Reproducir la lección en el player integrado
 * - Marcar lecciones como completadas
 * 
 * PARÁMETROS DE URL:
 * - id: ID del módulo a mostrar (ej: 'm1', 'm2', 'm3')
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con botón volver, título del módulo y descripción
 * 2. Barra de progreso del módulo con porcentaje
 * 3. Lista de tarjetas de lecciones, cada una muestra:
 *    - Ícono según tipo (video/podcast)
 *    - Título y duración
 *    - Badge "Completado" si está completada
 *    - Resumen de la lección
 *    - Transcripción (preview)
 *    - Botón "Reproducir" → abre el player
 *    - Botón "Marcar completado" → actualiza progreso
 * 
 * CÁLCULOS:
 * - completedCount: Cantidad de lecciones completadas en este módulo
 * - progressPercent: Porcentaje de progreso del módulo (0-100)
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a Mi Ruta
 * - Botón "Reproducir" → /player/[lessonId]
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta theme dark/light
 * - Live region para anunciar cambios de progreso
 * - Cada lección tiene accessibilityLabel descriptivo
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - completeLesson hará POST al backend para guardar progreso
 * - El progreso se sincronizará en tiempo real
 * ============================================================================
 */

import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function CourseDetailScreen() {
  const router = useRouter();
  // Obtener el ID del módulo desde la URL
  const { id } = useLocalSearchParams<{ id?: string }>();
  const courseId = Array.isArray(id) ? id[0] : id;
  
  // Obtener datos y funciones
  const { modules, completeLesson } = useCourses();
  const { theme, largeText, easyReading, noBorders } = useAppSettings();
  
  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#4B5563';

  // Buscar el módulo por ID
  const module = modules.find((m) => m.id === courseId);
  
  // Estado para mensajes de accesibilidad (live region)
  const [liveMessage, setLiveMessage] = useState('');

  // Si no se encuentra el módulo, mostrar error
  if (!module) {
    return (
      <View style={[styles.root, { backgroundColor: bg }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={20} color={text} />
          </Pressable>
          <Text style={[styles.title, { color: text }]}>Curso no encontrado</Text>
        </View>
        <Text style={[styles.subtitle, { color: sub }]}>Regresa y selecciona un curso válido.</Text>
      </View>
    );
  }

  // ========== CÁLCULOS DE PROGRESO ==========
  // Contar lecciones completadas
  const completedCount = module.lessons.filter((lesson) => lesson.completed).length;
  // Calcular porcentaje de progreso
  const progressPercent = module.lessons.length
    ? Math.round((completedCount / module.lessons.length) * 100)
    : 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
          style={[styles.backButton, noBorders && styles.backButtonNoBorder]}
        >
          <Ionicons name="chevron-back" size={20} color={text} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && { fontSize: 22 }]}>{module.title}</Text>
          <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 15 }]}>
            {easyReading ? 'Lista de lecciones.' : 'Lista completa de lecciones cortas con contenido práctico y aplicable a tu desarrollo profesional.'}
          </Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={[styles.progressText, { color: text }, largeText && { fontSize: 12 }]}>
          {progressPercent}% completado
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Elemento oculto para anunciar cambios de progreso a lectores de pantalla */}
        <Text accessibilityLiveRegion="polite" style={styles.srOnly}>{liveMessage}</Text>
        
        {/* Mapear cada lección del módulo */}
        {module.lessons.map((lesson, idx) => (
          <View
            key={lesson.id}
            style={[styles.lessonCard, theme === 'light' && styles.lessonCardLight, noBorders && styles.lessonCardNoBorder]}
            accessible
            accessibilityLabel={`Lección ${idx + 1} de ${module.lessons.length}. ${lesson.title}. ${lesson.mediaType === 'video' ? 'Video' : 'Podcast'}. ${lesson.durationMinutes} minutos. ${lesson.completed ? 'Completado' : 'Pendiente'}.`}
          >
            <View style={styles.lessonHeader}>
              <View style={[styles.lessonIcon, noBorders && styles.lessonIconNoBorder]}>
                <Ionicons
                  name={lesson.mediaType === 'video' ? 'videocam' : 'mic'}
                  size={16}
                  color={text}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.lessonTitle, { color: text }, largeText && { fontSize: 16 }]}>
                  {lesson.title}
                </Text>
                <Text style={[styles.lessonMeta, { color: sub }]}>
                  {easyReading 
                    ? `${lesson.durationMinutes} min` 
                    : `${lesson.mediaType === 'video' ? 'Video' : 'Podcast'} · Duración aproximada: ${lesson.durationMinutes} minutos`}
                </Text>
              </View>
              {lesson.completed && (
                <View style={styles.completedPill}>
                  <Text style={styles.completedPillText}>Completado</Text>
                </View>
              )}
            </View>

            <Text style={[styles.sectionLabel, { color: sub }]}>Resumen</Text>
            <Text style={[styles.sectionText, { color: text }]}>{lesson.summary}</Text>

            <Text style={[styles.sectionLabel, { color: sub }]}>Transcripción</Text>
            <Text style={[styles.sectionText, { color: text }]} numberOfLines={2}>
              {easyReading ? 'Disponible al reproducir' : 'Transcripción completa disponible en el reproductor integrado'}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.linkButton, noBorders && styles.linkButtonNoBorder]}
                accessibilityRole="button"
                accessibilityLabel={`Reproducir ${lesson.mediaType === 'video' ? 'video' : 'podcast'} ${lesson.title} dentro de la app`}
                accessibilityHint="Abre el reproductor integrado."
                onPress={() => router.push({ pathname: '/player/[lessonId]', params: { lessonId: lesson.id } })}
              >
                <Text style={[styles.linkButtonText, { color: text }]}>Reproducir</Text>
              </Pressable>
              <Pressable
                style={[styles.completeButton, lesson.completed && styles.completeButtonDisabled]}
                accessibilityRole="button"
                accessibilityLabel={`Marcar como completado ${lesson.title}`}
                accessibilityHint="Actualiza tu progreso del curso."
                onPress={() => {
                  if (!lesson.completed) {
                    // Calcular nuevo progreso
                    const newCompleted = completedCount + 1;
                    const newPercent = module.lessons.length ? Math.round((newCompleted / module.lessons.length) * 100) : 0;
                    // Actualizar mensaje de accesibilidad
                    setLiveMessage(`Progreso actualizado al ${newPercent} por ciento.`);
                    // Marcar lección como completada
                    completeLesson(module.id, lesson.id);
                  }
                }}
                disabled={lesson.completed}
              >
                <Text style={styles.completeButtonText}>
                  {lesson.completed ? 'Listo' : (easyReading ? 'Completar' : 'Marcar completado')}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    borderWidth: 0,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
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
    fontSize: 11,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 12,
  },
  lessonCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  lessonCardLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  lessonCardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  lessonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonIconNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  lessonMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  completedPill: {
    backgroundColor: ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  completedPillText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 11,
    marginTop: 6,
  },
  sectionText: {
    fontSize: 12,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  linkButton: {
    borderWidth: 1,
    borderColor: ACCENT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 40,
    justifyContent: 'center',
  },
  linkButtonNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 40,
    justifyContent: 'center',
  },
  completeButtonDisabled: {
    opacity: 0.6,
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
});
