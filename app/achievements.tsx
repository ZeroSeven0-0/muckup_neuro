/**
 * ============================================================================
 * ACHIEVEMENTS SCREEN (PANTALLA DE LOGROS)
 * ============================================================================
 * Ubicación: app/achievements.tsx
 * Ruta: /achievements (pantalla independiente)
 * 
 * PROPÓSITO:
 * Esta pantalla muestra todos los logros/badges disponibles en la app.
 * Permite al usuario ver cuáles ha desbloqueado y las condiciones para
 * desbloquear los que aún no tiene.
 * 
 * NOTA: Esta pantalla está siendo reemplazada por la tab "Logros" en el perfil.
 * Se mantiene por compatibilidad pero la navegación principal usa /profile?tab=achievements
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con botón volver y título "Tus Logros"
 * 2. Contador de logros obtenidos vs totales
 * 3. Grid de tarjetas de logros (2 columnas), cada una muestra:
 *    - Ícono del logro
 *    - Título y descripción
 *    - Caja de condición (cómo desbloquearlo)
 *    - Badge "Obtenido" si está desbloqueado
 *    - Opacidad reducida si no está desbloqueado
 * 
 * CÁLCULO DE LOGROS DESBLOQUEADOS:
 * Los logros se desbloquean según estas condiciones:
 * - first_step: Completar 1 módulo
 * - neuro_impulso_1: Completar 3 lecciones
 * - neuro_impulso_2: Completar 2 módulos
 * - neuro_impulso_3: Completar todos los módulos
 * - course_complete: Completar todos los módulos
 * - soft_skills_star: Completar 3 lecciones
 * - interview_ready: Completar el módulo de entrevistas
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a la pantalla anterior
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta highContrast (alto contraste)
 * - Soporta theme dark/light
 * - Cada logro tiene accessibilityLabel descriptivo
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - Los logros desbloqueados vendrán del backend
 * - Se sincronizarán automáticamente al completar lecciones/módulos
 * ============================================================================
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function AchievementsScreen() {
  const router = useRouter();
  // Obtener configuraciones de accesibilidad
  const { theme, highContrast, largeText, easyReading, noBorders } = useAppSettings();

  // Obtener datos de cursos para calcular logros
  const { modules } = useCourses();
  
  // ========== CÁLCULO DE LOGROS DESBLOQUEADOS ==========
  // Módulos completados (todas las lecciones completadas)
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((lesson) => lesson.completed)
  );
  
  // Total de lecciones completadas
  const completedLessonsCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  
  // Total de módulos disponibles
  const totalModules = modules.length;

  // Set de IDs de logros desbloqueados
  const earnedIds = new Set<string>();
  
  // Aplicar condiciones para desbloquear logros
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
  // Logro especial: completar módulo de entrevistas
  const entrevistasModule = modules.find((m) => m.title.toLowerCase().includes('entrevistas'));
  if (entrevistasModule && entrevistasModule.lessons.every((lesson) => lesson.completed)) {
    earnedIds.add('interview_ready');
  }

  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#334155';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={[
              styles.backButton,
              highContrast && styles.backButtonHC,
              theme === 'light' && styles.backButtonLight,
              noBorders && styles.backButtonNoBorder,
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && styles.titleLarge]}>
              Tus Logros
            </Text>
            <Text style={[styles.subtitle, { color: sub }, largeText && styles.subtitleLarge]}>
              {easyReading ? 'Revisa tus logros y cómo conseguirlos.' : 'Revisa todos tus logros desbloqueados y las condiciones específicas para desbloquear cada uno de los badges disponibles.'}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: sub }]}>
            {Array.from(earnedIds).length} de {ACHIEVEMENTS.length} logros
          </Text>
        </View>

        <View style={styles.grid}>
          {/* Mapear todos los logros disponibles */}
          {ACHIEVEMENTS.map((a) => {
            // Verificar si este logro está desbloqueado
            const earned = earnedIds.has(a.id);
            return (
              <View
                key={a.id}
                style={[
                  styles.card,
                  !earned && styles.cardLocked,
                  theme === 'light' && styles.cardLight,
                  highContrast && styles.cardHC,
                  noBorders && styles.cardNoBorder,
                ]}
                accessibilityLabel={`${a.title}. ${earned ? 'Obtenido' : 'No obtenido'}. Condición: ${a.condition}`}
              >
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={a.icon as any}
                    size={20}
                    color={earned ? '#FFFFFF' : theme === 'dark' ? '#9CA3AF' : '#64748B'}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: text }]}>{a.title}</Text>
                <Text style={[styles.cardDesc, { color: sub }]}>
                  {a.description}
                </Text>

                <View style={[styles.conditionBox, theme === 'light' && styles.conditionBoxLight, noBorders && styles.conditionBoxNoBorder]}>
                  <Text style={[styles.conditionLabel, { color: sub }]}>Condición</Text>
                  <Text style={[styles.conditionText, { color: text }]}>{a.condition}</Text>
                </View>

                {earned && (
                  <View style={styles.earnedPill}>
                    <Text style={styles.earnedPillText}>Obtenido</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  backButtonHC: {
    borderColor: ACCENT,
  },
  backButtonLight: {
    borderColor: '#000000',
  },
  backButtonNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  title: { fontSize: 22, fontWeight: '700' },
  titleLarge: { fontSize: 26 },
  subtitle: { fontSize: 14, marginTop: 4 },
  subtitleLarge: { fontSize: 16 },
  metaRow: {
    marginBottom: 12,
  },
  metaText: { fontSize: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(31,41,55,1)',
  },
  cardLight: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  cardHC: {
    borderColor: ACCENT,
  },
  cardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  cardLocked: { opacity: 0.65 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  cardDesc: { fontSize: 11, marginBottom: 10 },
  conditionBox: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
  },
  conditionBoxLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  conditionBoxNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  conditionLabel: { fontSize: 10, marginBottom: 4 },
  conditionText: { fontSize: 11, fontWeight: '600' },
  earnedPill: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: ACCENT,
  },
  earnedPillText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
});
