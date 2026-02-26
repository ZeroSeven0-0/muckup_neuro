import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useCourses } from '@/contexts/CoursesContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Tab principal: Dashboard B2C (Inicio)
// Diseño simplificado, con colores y tarjetas alineadas con el concepto que definimos.

const ACCENT = '#8379CD';

export default function DashboardScreen() {
  const router = useRouter();
  const { theme, highContrast, largeText } = useAppSettings();
  const { modules } = useCourses();

  // Datos mock basados en el Dashboard web de referencia
  const userFirstName = 'Alex';
  const totalPoints = 320;
  const totalAchievements = 5;

  const totalModules = modules.length;
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)
  ).length;
  const inProgressModules = modules.filter(
    (m) => m.lessons.some((l) => l.completed) && !m.lessons.every((l) => l.completed)
  ).length;
  const remainingModules = totalModules - completedModules;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const nextModuleIndex = modules.findIndex((m) => m.lessons.some((l) => !l.completed));
  const nextModuleOrder = nextModuleIndex >= 0 ? nextModuleIndex + 1 : 0;
  const nextModuleTitle =
    nextModuleIndex >= 0 ? modules[nextModuleIndex].title : 'Todos los cursos completos';
  const nextModuleDurationMinutes =
    nextModuleIndex >= 0
      ? modules[nextModuleIndex].lessons.find((l) => !l.completed)?.durationMinutes ?? 0
      : 0;
  const upcomingSessions = [
    {
      id: 's1',
      type: 'sesión 1: estrategia',
      dateLabel: 'Jueves 14 de marzo',
      time: '18:00h',
      status: 'Confirmada',
    },
  ];

  const earnedIds = new Set(['first_step', 'cv_master', 'linkedin_pro', 'neuro_impulso_1', 'job_hunter']);
  const earnedCount = Array.from(earnedIds).length;

  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#334155';

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
              Continúa tu transformación profesional con una ruta guiada, sin distracciones, con
              evidencias claras y pasos accionables.
            </Text>
          </View>
          <Pressable
            style={styles.profileAvatar}
            accessibilityRole="button"
            accessibilityLabel="Ver y editar tu perfil"
            hitSlop={8}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        <View style={styles.quickStatsRow}>
          <View
            accessible
            accessibilityLabel={`Puntos totales: ${totalPoints}`}
            style={[styles.quickStatCard, theme === 'light' && styles.quickStatCardLight]}
          >
            <View style={styles.quickStatIcon}>
              <Ionicons name="trophy" size={20} color={ACCENT} />
            </View>
            <View>
              <Text
                style={[
                  styles.quickStatValue,
                  { color: theme === 'dark' ? '#FFFFFF' : '#000000' },
                ]}
              >
                {totalPoints}
              </Text>
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme === 'dark' ? '#C7C9E8' : '#4B5563' },
                ]}
              >
                Puntos
              </Text>
            </View>
          </View>
          <View
            accessible
            accessibilityLabel={`Logros totales: ${totalAchievements}`}
            style={[styles.quickStatCard, theme === 'light' && styles.quickStatCardLight]}
          >
            <View style={styles.quickStatIcon}>
              <Ionicons name="sparkles" size={20} color={ACCENT} />
            </View>
            <View>
              <Text
                style={[
                  styles.quickStatValue,
                  { color: theme === 'dark' ? '#FFFFFF' : '#000000' },
                ]}
              >
                {totalAchievements}
              </Text>
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme === 'dark' ? '#C7C9E8' : '#4B5563' },
                ]}
              >
                Logros
              </Text>
            </View>
          </View>
        </View>

        {/* Acceso rápido principal */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
          ]}
          accessibilityLabel="Accesos rápidos a áreas clave."
        >
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: text }]}>Accesos rápidos</Text>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a Mi Ruta de aprendizaje"
            accessibilityHint="Abre tu ruta con cursos y lecciones."
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="school" size={20} color={ACCENT} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: text }]}>Mi Ruta de Aprendizaje</Text>
          </Pressable>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a la pantalla para agendar sesión 1 a 1"
            accessibilityHint="Abre tu agenda de sesiones."
            onPress={() => router.push('/(tabs)/agenda')}
          >
            <Ionicons name="calendar" size={20} color={ACCENT} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: text }]}>Agendar Sesión 1:1</Text>
          </Pressable>
        </View>

        {/* Progreso general (más protagonista) */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
          ]}
          accessibilityLabel={`Progreso general. ${progressPercent} por ciento completado. ${completedModules} módulos completados y ${remainingModules} restantes.`}
        >
          <Text accessibilityRole="header" style={[styles.cardLabel, { color: sub }]}>Tu Progreso General</Text>
          <View style={styles.progressRow}>
            <View style={styles.fakeCircle}>
              <Text style={[styles.fakeCircleText, { color: text }]}>{progressPercent}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: text }]}>
                {completedModules} módulos completados · {inProgressModules} en curso
              </Text>
              <Text style={[styles.secondaryText, { color: sub }]}>
                {remainingModules} módulos restantes · recomendado en bloques de 10–15 min.
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
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continuar aprendizaje. Pulsa para ir a tu siguiente módulo."
          onPress={() => router.push('/(tabs)/explore')}
        >
          <View style={[styles.highlightHeader, theme === 'light' && styles.nextModuleCardLight]}>
            <View style={styles.highlightIcon}>
              <Ionicons name="flag" size={22} color={ACCENT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: text }]}>Continúa donde lo dejaste</Text>
              <Text style={[styles.cardSubtitle, { color: sub }]}>
                Tu próximo módulo te espera con video-coaching y actividades accionables.
              </Text>
            </View>
          </View>

          <View style={[styles.nextModuleCard, theme === 'light' && styles.nextModuleCardLight]}>
            <View style={styles.nextModuleBadge}>
              <Text style={styles.nextModuleOrder}>{nextModuleOrder}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: text }]}>{nextModuleTitle}</Text>
              <Text style={[styles.secondaryText, { color: sub }]}>
                ~ {nextModuleDurationMinutes} min · enfócate en un objetivo por sesión.
              </Text>
            </View>
          </View>

          <View style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Continuar aprendizaje</Text>
          </View>
        </Pressable>

        {/* Logros: mostrar pocos + ver todos */}
        <View
          style={[
            styles.card,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
          ]}
          accessibilityLabel="Logros y badges de tu progreso."
        >
          <View style={styles.sectionHeader}>
            <Text accessibilityRole="header" style={[styles.sectionTitle, { color: text }, largeText && { fontSize: 18 }]}>Tus Logros</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver todos tus logros"
              onPress={() => router.push('/achievements')}
            >
              <Text style={styles.sectionLink}>Ver todos</Text>
            </Pressable>
          </View>
          <Text style={[styles.sectionMeta, { color: sub }, largeText && { fontSize: 13 }]}>
            {earnedCount} de {ACHIEVEMENTS.length} badges · toca “Ver todos” para condiciones.
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
                  ]}
                  accessibilityLabel={`${a.title}. ${earned ? 'Obtenido' : 'No obtenido'}. ${a.points} puntos.`}
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
                  <Text style={[styles.achievementDescription, { color: sub }]} numberOfLines={largeText ? 2 : 3}>
                    {a.description}
                  </Text>
                  <View style={styles.achievementPointsRow}>
                    <Ionicons name="ribbon" size={14} color="#9CA3AF" />
                    <Text style={[styles.achievementPointsText, { color: sub }]}>{a.points} pts</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Próximas sesiones */}
        {upcomingSessions.length > 0 && (
          <View
            style={styles.card}
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
                  <Text style={[styles.sessionType, { color: text }]}>{s.type}</Text>
                  <Text style={[styles.sessionMeta, { color: sub }]}>
                    {s.dateLabel} · {s.time}
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
    paddingTop: 32,
    paddingBottom: 96,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleLarge: {
    fontSize: 26,
  },
  subtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginBottom: 16,
  },
  subtitleLarge: {
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  quickStatsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginTop: -20,
    gap: 10,
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
  quickStatCard: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(225, 228, 243, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  quickStatCardLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  quickStatIcon: {
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  quickStatValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  quickStatLabel: {
    color: '#C7C9E8',
    fontSize: 11,
  },
  card: {
    backgroundColor: 'rgba(225, 228, 243, 0.12)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 228, 243, 0.16)',
    marginBottom: 12,
  },
  cardLight: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderColor: 'rgba(15,23,42,0.12)',
  },
  cardHC: {
    borderColor: ACCENT,
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
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'space-between',
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
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardHalf: {
    flex: 1,
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
  fakeCircleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
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
  achievementPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  achievementPointsText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingHorizontal: 24,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  highlightCard: {
    borderColor: 'rgba(131, 121, 205, 0.6)',
    backgroundColor: 'rgba(131, 121, 205, 0.15)',
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
    backgroundColor: 'rgba(131, 121, 205, 0.25)',
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
