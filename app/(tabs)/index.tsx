/**
 * ============================================================================
 * DASHBOARD SCREEN (PANTALLA DE INICIO)
 * ============================================================================
 * Ubicación: app/(tabs)/index.tsx
 * Ruta: /(tabs)/ (pantalla principal al abrir la app)
 * 
 * PROPÓSITO:
 * Esta es la pantalla principal que ve el usuario al abrir la app.
 * Muestra un resumen completo de su progreso, próximos pasos, logros y sesiones.
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con saludo personalizado y botón de perfil
 * 2. Accesos rápidos (Mi Ruta, Agendar Sesión)
 * 3. Progreso general (% completado, módulos terminados)
 * 4. Continuar aprendizaje (siguiente módulo recomendado)
 * 5. Tus Logros (4 badges + botón "Ver todos")
 * 6. Próximas sesiones (si hay sesiones agendadas)
 * 7. FAB de asistente IA (botón flotante)
 * 
 * CÁLCULOS IMPORTANTES:
 * - progressPercent: Porcentaje de lecciones completadas del total
 * - completedModules: Módulos donde TODAS las lecciones están completadas
 * - inProgressModules: Módulos con al menos 1 lección completada pero no todas
 * - earnedIds: Set de IDs de logros desbloqueados según condiciones
 * 
 * NAVEGACIÓN:
 * - Botón perfil → /profile
 * - Mi Ruta → /(tabs)/explore
 * - Agendar Sesión → /(tabs)/agenda
 * - Ver todos (logros) → /profile con tab=achievements
 * - Continuar aprendizaje → /(tabs)/explore
 * 
 * ACCESIBILIDAD:
 * - Todos los botones tienen accessibilityRole y accessibilityLabel
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta highContrast (alto contraste)
 * - Soporta theme dark/light
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - userFirstName vendrá del perfil del usuario autenticado
 * - modules vendrá de la API (ya está en CoursesContext)
 * - sessions vendrá de la API (ya está en SessionsContext)
 * - earnedIds se calculará en el backend según el progreso real
 * ============================================================================
 */

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { useSessions } from '@/contexts/SessionsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio (usado en botones, bordes, íconos)

export default function DashboardScreen() {
  const router = useRouter();
  // Obtener configuraciones de accesibilidad del usuario
  const { theme, highContrast, largeText, noBorders, easyReading } = useAppSettings();
  // Obtener datos de cursos y sesiones
  const { modules } = useCourses();
  const { sessions } = useSessions();

  // ========== DATOS DEL USUARIO ==========
  // TODO: Cuando conectes con el backend, obtén esto del perfil del usuario autenticado
  const userFirstName = 'Alex';

  // ========== CÁLCULOS DE PROGRESO ==========
  // Total de módulos disponibles
  const totalModules = modules.length;
  
  // Módulos completados: donde TODAS las lecciones están completadas
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)
  ).length;
  
  // Módulos en progreso: al menos 1 lección completada pero no todas
  const inProgressModules = modules.filter(
    (m) => m.lessons.some((l) => l.completed) && !m.lessons.every((l) => l.completed)
  ).length;
  
  // Módulos restantes por completar
  const remainingModules = totalModules - completedModules;
  
  // Total de lecciones en todos los módulos
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  
  // Lecciones completadas en todos los módulos
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  
  // Porcentaje de progreso general (0-100)
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ========== SIGUIENTE MÓDULO RECOMENDADO ==========
  // Buscar el primer módulo que tenga lecciones sin completar
  const nextModuleIndex = modules.findIndex((m) => m.lessons.some((l) => !l.completed));
  const nextModuleOrder = nextModuleIndex >= 0 ? nextModuleIndex + 1 : 0;
  const nextModuleTitle =
    nextModuleIndex >= 0 ? modules[nextModuleIndex].title : 'Todos los cursos completos';
  const nextModuleDurationMinutes =
    nextModuleIndex >= 0
      ? modules[nextModuleIndex].lessons.find((l) => !l.completed)?.durationMinutes ?? 0
      : 0;
  
  // Sesiones próximas (todas las sesiones disponibles)
  const upcomingSessions = sessions;

  // ========== CÁLCULO DE LOGROS DESBLOQUEADOS ==========
  // Contar lecciones completadas para condiciones de logros
  const completedLessonsCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  
  // Set de IDs de logros desbloqueados
  const earnedIds = new Set<string>();
  
  // Condiciones para desbloquear logros:
  if (completedModules >= 1) earnedIds.add('first_step');                    // Primer módulo completado
  if (completedModules >= 2) earnedIds.add('neuro_impulso_2');              // Dos módulos completados
  if (completedModules === totalModules && totalModules > 0) {              // Todos los módulos completados
    earnedIds.add('neuro_impulso_3');
    earnedIds.add('course_complete');
  }
  if (completedLessonsCount >= 3) {                                         // Al menos 3 lecciones completadas
    earnedIds.add('soft_skills_star');
    earnedIds.add('neuro_impulso_1');
  }
  // Logro especial: completar módulo de entrevistas
  const entrevistasModule = modules.find((m) => m.title.toLowerCase().includes('entrevistas'));
  if (entrevistasModule && entrevistasModule.lessons.every((l) => l.completed)) {
    earnedIds.add('interview_ready');
  }
  
  // Contar total de logros desbloqueados
  const earnedCount = Array.from(earnedIds).length;

  // ========== COLORES SEGÚN TEMA ==========
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';      // Fondo principal
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';    // Texto principal
  const sub = theme === 'dark' ? '#C7C9E8' : '#64748B';     // Texto secundario

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Panel principal de la experiencia B2C"
      >
        {/* Header con saludo y avatar */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: text }, largeText && styles.titleLarge]}>
              ¡Hola, {userFirstName}! 👋
            </Text>
            <Text style={[styles.subtitle, { color: sub }, largeText && styles.subtitleLarge]}>
              {easyReading 
                ? 'Sigue tu ruta paso a paso.' 
                : 'Continúa tu transformación profesional con una ruta guiada, sin distracciones, con evidencias claras y pasos accionables que te llevarán a tu objetivo.'}
            </Text>
          </View>
          <Pressable
            style={[styles.profileAvatar, theme === 'light' && styles.profileAvatarLight, noBorders && styles.profileAvatarNoBorder]}
            accessibilityRole="button"
            accessibilityLabel="Ver y editar tu perfil"
            hitSlop={8}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={20} color={theme === 'dark' ? '#9CA3AF' : ACCENT} />
          </Pressable>
        </View>

        {/* Acceso rápido principal */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
            noBorders && styles.cardNoBorder,
          ]}
          accessibilityLabel="Accesos rápidos a áreas clave."
        >
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: text }, largeText && { fontSize: 18 }]}>Accesos rápidos</Text>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a Mi Ruta de aprendizaje"
            accessibilityHint="Abre tu ruta con cursos y lecciones."
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="school" size={20} color={theme === 'dark' ? ACCENT : '#0F172A'} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: text }, largeText && { fontSize: 16 }]}>Mi Ruta de Aprendizaje</Text>
          </Pressable>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a la pantalla para agendar sesión 1 a 1"
            accessibilityHint="Abre tu agenda de sesiones."
            onPress={() => router.push('/(tabs)/agenda')}
          >
            <Ionicons name="calendar" size={20} color={theme === 'dark' ? ACCENT : '#0F172A'} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: text }, largeText && { fontSize: 16 }]}>Agendar Sesión 1:1</Text>
          </Pressable>
        </View>

        {/* Progreso general (más protagonista) */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
            noBorders && styles.cardNoBorder,
          ]}
          accessibilityLabel={`Progreso general. ${progressPercent} por ciento completado. ${completedModules} módulos completados y ${remainingModules} restantes.`}
        >
          <Text accessibilityRole="header" style={[styles.cardLabel, { color: sub }, largeText && { fontSize: 13 }]}>
            {easyReading ? 'Tu Progreso' : 'Tu Progreso General'}
          </Text>
          <View style={styles.progressRow}>
            <View style={[styles.fakeCircle, noBorders && styles.fakeCircleNoBorder]}>
              <Text style={[styles.fakeCircleText, { color: text }]}>{progressPercent}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: text }, largeText && { fontSize: 15 }]}>
                {completedModules} módulos completados · {inProgressModules} en curso
              </Text>
              <Text style={[styles.secondaryText, { color: sub }, largeText && { fontSize: 13 }]}>
                {easyReading 
                  ? `Faltan ${remainingModules} módulos` 
                  : `${remainingModules} módulos restantes · te recomendamos completarlos en bloques de 10–15 minutos para mejor comprensión y retención del contenido.`}
              </Text>
            </View>
          </View>
        </View>

        {/* Continuar aprendizaje */}
        <Pressable
          style={[
            styles.card,
            styles.highlightCard,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
            noBorders && styles.cardNoBorder,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continuar aprendizaje. Pulsa para ir a tu siguiente módulo."
          onPress={() => router.push('/(tabs)/explore')}
        >
          <View style={[styles.highlightHeader, theme === 'light' && styles.nextModuleCardLight]}>
            <View style={styles.highlightIcon}>
            <Ionicons name="flag" size={22} color={theme === 'dark' ? ACCENT : '#0F172A'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: text }, largeText && { fontSize: 20 }]}>
                {easyReading ? 'Continúa aprendiendo' : 'Continúa donde lo dejaste'}
              </Text>
              <Text style={[styles.cardSubtitle, { color: sub }, largeText && { fontSize: 15 }]}>
                {easyReading 
                  ? 'Tu siguiente módulo está listo.' 
                  : 'Tu próximo módulo te espera con video-coaching profesional y actividades accionables diseñadas para tu crecimiento.'}
              </Text>
            </View>
          </View>

          <View style={[styles.nextModuleCard, theme === 'light' && styles.nextModuleCardLight, noBorders && styles.nextModuleCardNoBorder]}>
            <View style={styles.nextModuleBadge}>
              <Text style={styles.nextModuleOrder}>{nextModuleOrder}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: text }, largeText && { fontSize: 15 }]}>{nextModuleTitle}</Text>
              <Text style={[styles.secondaryText, { color: sub }, largeText && { fontSize: 13 }]}>
                {easyReading 
                  ? `Duración: ${nextModuleDurationMinutes} minutos` 
                  : `Aproximadamente ${nextModuleDurationMinutes} minutos · recomendado completar en bloques de 10–15 minutos para mejor retención.`}
              </Text>
            </View>
          </View>

          <View style={styles.primaryButton}>
          <Text style={[styles.primaryButtonText, largeText && { fontSize: 16 }]}>Continuar aprendizaje</Text>
          </View>
        </Pressable>

        {/* Logros: mostrar pocos + ver todos */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
            noBorders && styles.cardNoBorder,
          ]}
          accessibilityLabel="Logros y badges de tu progreso."
        >
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" style={[styles.sectionTitle, { color: text }, largeText && { fontSize: 18 }]}>Tus Logros</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver todos tus logros"
              onPress={() => router.push({ pathname: '/profile', params: { tab: 'achievements' } })}
            >
              <Text style={styles.sectionLink}>Ver todos</Text>
            </Pressable>
          </View>
          <Text style={[styles.sectionMeta, { color: sub }, largeText && { fontSize: 14 }]}>
            {easyReading 
              ? `Tienes ${earnedCount} de ${ACHIEVEMENTS.length} logros` 
              : `Has desbloqueado ${earnedCount} de ${ACHIEVEMENTS.length} logros disponibles · toca "Ver todos" para conocer las condiciones de cada uno y cómo desbloquearlos.`}
          </Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.slice(0, 4).map((a) => {
              const earned = earnedIds.has(a.id);
              return (
                <View
                  key={a.id}
                  style={[
                    styles.achievementCard,
                    theme === 'light' && styles.achievementCardLight,
                    !earned && styles.achievementCardLocked,
                    noBorders && styles.achievementCardNoBorder,
                  ]}
                  accessibilityLabel={`${a.title}. ${earned ? 'Obtenido' : 'No obtenido'}.`}
                >
                  <View
                    style={[
                      styles.achievementIconCircle,
                      theme === 'light' && styles.achievementIconCircleLight,
                    ]}
                  >
                    <Ionicons
                      name={a.icon as any}
                      size={20}
                      color={
                        earned ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : theme === 'dark' ? '#9CA3AF' : '#64748B'
                      }
                    />
                  </View>
                  <Text style={[styles.achievementTitle, { color: text }, largeText && { fontSize: 14 }]}>{a.title}</Text>
                  <Text style={[styles.achievementDescription, { color: sub }, largeText && { fontSize: 12 }]}>
                    {a.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Próximas sesiones */}
        {upcomingSessions.length > 0 && (
          <View
            style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}
            accessibilityLabel="Próximas sesiones de coaching confirmadas."
          >
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" style={[styles.sectionTitle, { color: text }]}>Próximas sesiones</Text>
              <Text
                style={styles.sectionLink}
                accessibilityRole="button"
                accessibilityLabel="Ver todas tus próximas sesiones"
                onPress={() => router.push('/(tabs)/agenda')}
              >
                Ver todas
              </Text>
            </View>
            {upcomingSessions.map((s) => (
              <View key={s.id} style={styles.sessionItem}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessionType, { color: text }]}>{s.title}</Text>
                  <Text style={[styles.sessionMeta, { color: sub }]}>
                    {s.dateLabel} · {s.timeLabel}
                  </Text>
                </View>
                <View style={styles.sessionStatusPill}>
                  <Text style={styles.sessionStatusText}>{s.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* FAB Agente IA */}
        <View
          style={styles.aiFab}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Abrir asistente de inteligencia artificial para dudas y consultas. El asistente conoce tu módulo actual."
          accessibilityHint="Se abrirá el asistente en una ventana superpuesta."
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#000000" />
        </View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 96,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleLarge: {
    fontSize: 28,
  },
  subtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginBottom: 16,
  },
  subtitleLarge: {
    fontSize: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(31,41,55,1)',
  },
  profileAvatarLight: {
    backgroundColor: 'rgba(15,23,42,0.04)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  profileAvatarNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
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
  cardHC: {
    borderColor: ACCENT,
  },
  cardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  cardLabel: {
    color: '#C7C9E8',
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginTop: 4,
  },
  secondaryText: {
    color: '#C7C9E8',
    fontSize: 12,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  fakeCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    borderColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeCircleNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  fakeCircleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
  },
  highlightCard: {
    borderColor: 'rgba(107, 114, 128, 0.6)',
    backgroundColor: 'rgba(107, 114, 128, 0.15)',
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(107, 114, 128, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextModuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
    gap: 12,
  },
  nextModuleCardLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  nextModuleCardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  nextModuleBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextModuleOrder: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionMeta: {
    color: '#C7C9E8',
    fontSize: 12,
  },
  sectionLink: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '500',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    rowGap: 12,
  },
  achievementCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(31,41,55,1)',
  },
  achievementCardLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  achievementCardNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  achievementIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementIconCircleLight: {
    backgroundColor: 'rgba(2,6,23,0.06)',
  },
  achievementTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#A5B4FC',
    fontSize: 11,
    marginBottom: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  sessionType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sessionMeta: {
    color: '#C7C9E8',
    fontSize: 12,
  },
  sessionStatusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  sessionStatusText: {
    color: '#4ade80',
    fontSize: 11,
    fontWeight: '600',
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quickLinkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  aiFab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
