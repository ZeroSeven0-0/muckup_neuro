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
 * sesiones agendadas. Es el hub central de la experiencia B2C.
 * 
 * SECCIONES DE LA PANTALLA:
 * 
 * 1. HEADER CON SALUDO
 *    - Saludo personalizado con nombre del usuario
 *    - Subtítulo motivacional (cambia con easyReading)
 *    - Botón de perfil en la esquina superior derecha
 * 
 * 2. ACCESOS RÁPIDOS
 *    - Mi Ruta de Aprendizaje → Navega a /(tabs)/explore
 *    - Agendar Sesión 1:1 → Navega a /(tabs)/agenda
 * 
 * 3. PROGRESO GENERAL
 *    - Círculo con porcentaje de progreso
 *    - Módulos completados y en curso
 *    - Módulos restantes con recomendación de tiempo
 * 
 * 4. CONTINUAR APRENDIZAJE (DESTACADO)
 *    - Muestra el siguiente módulo pendiente
 *    - Badge con número de orden del módulo
 *    - Duración estimada
 *    - Botón "Continuar aprendizaje" → Navega a /(tabs)/explore
 * 
 * 5. TUS LOGROS
 *    - Grid con 4 logros (primeros del array ACHIEVEMENTS)
 *    - Muestra icono, título y descripción
 *    - Logros bloqueados aparecen con opacidad reducida
 *    - Botón "Ver todos" → Navega a /profile con tab=achievements
 * 
 * 6. PRÓXIMAS SESIONES (si hay sesiones)
 *    - Lista de sesiones agendadas
 *    - Muestra título, fecha, hora y estado
 *    - Botón "Ver todas" → Navega a /(tabs)/agenda
 * 
 * 7. FAB AGENTE IA (flotante)
 *    - Botón flotante en esquina inferior derecha
 *    - Abre asistente de IA (funcionalidad pendiente)
 * 
 * ACCESIBILIDAD:
 * - Todos los elementos tienen accessibilityLabel y accessibilityRole
 * - Soporta texto grande (largeText)
 * - Soporta alto contraste (highContrast)
 * - Soporta modo sin bordes (noBorders)
 * - Soporta lectura fácil (easyReading) con textos simplificados
 * - Tema claro/oscuro con colores de alto contraste
 * 
 * TEMA DE COLORES:
 * - Modo oscuro: bg #000000, text #FFFFFF, sub #C7C9E8
 * - Modo claro: bg #FFFFFF, text #0F172A, sub #64748B
 * - Acento: #6B7280 (gris) - usado en botones y elementos destacados
 * 
 * CÁLCULO DE LOGROS:
 * Los logros se calculan usando la función getEarnedAchievements() de
 * utils/achievements.ts, que determina qué logros ha desbloqueado el
 * usuario basándose en módulos y lecciones completadas.
 * 
 * DATOS:
 * - Módulos y lecciones: CoursesContext
 * - Sesiones: SessionsContext
 * - Configuración: AppSettingsContext
 * - Logros: constants/b2c-mock.ts
 * 
 * NAVEGACIÓN:
 * - Perfil: router.push('/profile')
 * - Mi Ruta: router.push('/(tabs)/explore')
 * - Agenda: router.push('/(tabs)/agenda')
 * - Logros: router.push({ pathname: '/profile', params: { tab: 'achievements' } })
 */

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { useSessions } from '@/contexts/SessionsContext';
import { getEarnedAchievements } from '@/utils/achievements';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Color de acento usado en toda la app (gris)
const ACCENT = '#6B7280';

export default function DashboardScreen() {
  // ========== HOOKS Y CONTEXTOS ==========
  const router = useRouter();
  
  // Configuración de accesibilidad y tema
  const { theme, highContrast, textScale, noBorders, easyReading } = useAppSettings();
  
  // Datos de cursos y sesiones
  const { modules } = useCourses();
  const { sessions } = useSessions();

  // Estilos globales
  const commonStyles = getCommonStyles(theme, noBorders, highContrast);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);

  // ========== DATOS DEL USUARIO ==========
  // TODO: Obtener del backend cuando esté implementado
  const userFirstName = 'Alex';

  // ========== CÁLCULOS DE PROGRESO ==========
  
  // Total de módulos en el curso
  const totalModules = modules.length;
  
  // Módulos completados (todas sus lecciones tienen completed: true)
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((l) => l.completed)
  ).length;
  
  // Módulos en progreso (al menos una lección completada, pero no todas)
  const inProgressModules = modules.filter(
    (m) => m.lessons.some((l) => l.completed) && !m.lessons.every((l) => l.completed)
  ).length;
  
  // Módulos restantes
  const remainingModules = totalModules - completedModules;
  
  // Total de lecciones en todos los módulos
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  
  // Lecciones completadas en total
  const completedLessons = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  );
  
  // Porcentaje de progreso general
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ========== SIGUIENTE MÓDULO ==========
  
  // Encontrar el primer módulo que tenga lecciones pendientes
  const nextModuleIndex = modules.findIndex((m) => m.lessons.some((l) => !l.completed));
  
  // Número de orden del siguiente módulo (1-indexed)
  const nextModuleOrder = nextModuleIndex >= 0 ? nextModuleIndex + 1 : 0;
  
  // Título del siguiente módulo
  const nextModuleTitle =
    nextModuleIndex >= 0 ? modules[nextModuleIndex].title : 'Todos los cursos completos';
  
  // Duración de la primera lección pendiente del siguiente módulo
  const nextModuleDurationMinutes =
    nextModuleIndex >= 0
      ? modules[nextModuleIndex].lessons.find((l) => !l.completed)?.durationMinutes ?? 0
      : 0;
  
  // ========== SESIONES Y LOGROS ==========
  
  // Sesiones próximas (todas las sesiones del contexto)
  const upcomingSessions = sessions;

  // Calcular logros desbloqueados usando la función de utils
  const { earnedIds, earnedCount } = getEarnedAchievements(modules);

  return (
    <View style={commonStyles.root}>
      <View style={commonStyles.gradient} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={commonStyles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        accessibilityLabel="Panel principal de la experiencia B2C"
      >
        {/* Header con logotipo y botón de perfil */}
        <View style={styles.topBar}>
          {/* Logotipo en esquina superior izquierda - cambia según el tema */}
          <Image 
            source={theme === 'dark' 
              ? require('@/assets/images/logo.png')
              : require('@/assets/images/logo-light.png')
            }
            style={commonStyles.logo}
            resizeMode="contain"
            accessibilityLabel="Logotipo Neurogestión"
          />
          
          {/* Botón de perfil en esquina superior derecha */}
          <Pressable
            style={[styles.profileAvatar, theme === 'light' && styles.profileAvatarLight, noBorders && styles.profileAvatarNoBorder]}
            accessibilityRole="button"
            accessibilityLabel="Ver y editar tu perfil"
            hitSlop={8}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person" size={28} color={theme === 'dark' ? '#9CA3AF' : ACCENT} />
          </Pressable>
        </View>

        {/* Saludo debajo del logotipo */}
        <View style={styles.greetingSection}>
          <Text style={[styles.title, { color: colors.text, fontSize: 22 * textScale }]}>
            ¡Hola, {userFirstName}! 👋
          </Text>
          <Text style={[styles.subtitle, { color: colors.sub, fontSize: 14 * textScale }]}>
            {easyReading 
              ? 'Sigue tu ruta paso a paso.' 
              : 'Continúa tu transformación profesional con una ruta guiada, sin distracciones, con evidencias claras y pasos accionables que te llevarán a tu objetivo.'}
          </Text>
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
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * textScale }]}>Accesos rápidos</Text>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a Mi Ruta de aprendizaje"
            accessibilityHint="Abre tu ruta con cursos y lecciones."
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="school" size={20} color={theme === 'dark' ? ACCENT : '#0F172A'} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: colors.text, fontSize: 14 * textScale }]}>Mi Ruta de Aprendizaje</Text>
          </Pressable>
          <Pressable
            style={styles.quickLink}
            accessibilityRole="button"
            accessibilityLabel="Ir a la pantalla para agendar sesión 1 a 1"
            accessibilityHint="Abre tu agenda de sesiones."
            onPress={() => router.push('/(tabs)/agenda')}
          >
            <Ionicons name="calendar" size={20} color={theme === 'dark' ? ACCENT : '#0F172A'} style={{ marginRight: 8 }} />
            <Text style={[styles.quickLinkText, { color: colors.text, fontSize: 14 * textScale }]}>Agendar Sesión 1:1</Text>
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
          <Text accessibilityRole="header" style={[styles.cardLabel, { color: colors.sub, fontSize: 12 * textScale }]}>
            {easyReading ? 'Tu Progreso' : 'Tu Progreso General'}
          </Text>
          <View style={styles.progressRow}>
            <View style={[styles.fakeCircle, noBorders && styles.fakeCircleNoBorder]}>
              <Text style={[styles.fakeCircleText, { color: colors.text, fontSize: 22 * textScale }]}>{progressPercent}%</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: colors.text, fontSize: 14 * textScale }]}>
                {completedModules} módulos completados · {inProgressModules} en curso
              </Text>
              <Text style={[styles.secondaryText, { color: colors.sub, fontSize: 12 * textScale }]}>
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
            theme === 'light' && styles.highlightCardLight,
            theme === 'light' && styles.cardLight,
            highContrast && styles.cardHC,
            noBorders && styles.cardNoBorder,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Continuar aprendizaje. Pulsa para ir a tu siguiente módulo."
          onPress={() => router.push('/(tabs)/explore')}
        >
          <View style={[styles.highlightHeader, theme === 'light' && styles.nextModuleCardLight]}>
            <View style={[styles.highlightIcon, theme === 'light' && styles.highlightIconLight]}>
            <Ionicons name="flag" size={22} color={theme === 'dark' ? ACCENT : '#000000'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text, fontSize: 18 * textScale }]}>
                {easyReading ? 'Continúa aprendiendo' : 'Continúa donde lo dejaste'}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.sub, fontSize: 14 * textScale }]}>
                {easyReading 
                  ? 'Tu siguiente módulo está listo.' 
                  : 'Tu próximo módulo te espera con video-coaching profesional y actividades accionables diseñadas para tu crecimiento.'}
              </Text>
            </View>
          </View>

          <View style={[styles.nextModuleCard, theme === 'light' && styles.nextModuleCardLight, noBorders && styles.nextModuleCardNoBorder]}>
            <View style={[styles.nextModuleBadge, theme === 'light' && styles.nextModuleBadgeLight]}>
              <Text style={[styles.nextModuleOrder, { fontSize: 18 * textScale }, theme === 'light' && styles.nextModuleOrderLight]}>{nextModuleOrder}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardSubtitle, { color: colors.text, fontSize: 14 * textScale }]}>{nextModuleTitle}</Text>
              <Text style={[styles.secondaryText, { color: colors.sub, fontSize: 12 * textScale }]}>
                {easyReading 
                  ? `Duración: ${nextModuleDurationMinutes} minutos` 
                  : `Aproximadamente ${nextModuleDurationMinutes} minutos · recomendado completar en bloques de 10–15 minutos para mejor retención.`}
              </Text>
            </View>
          </View>

          <View style={[
            styles.primaryButton, 
            theme === 'light' && styles.primaryButtonLight,
            theme === 'light' && noBorders && styles.primaryButtonLightNoBorder,
            theme === 'dark' && noBorders && styles.primaryButtonDarkNoBorder,
          ]}>
          <Text style={[styles.primaryButtonText, { fontSize: 14 * textScale }, theme === 'light' && styles.primaryButtonTextLight]}>Continuar aprendizaje</Text>
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
            <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * textScale }]}>Tus Logros</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver todos tus logros"
              onPress={() => router.push({ pathname: '/profile', params: { tab: 'achievements' } })}
            >
              <Text style={[styles.sectionLink, { fontSize: 12 * textScale }]}>Ver todos</Text>
            </Pressable>
          </View>
          <Text style={[styles.sectionMeta, { color: colors.sub, fontSize: 12 * textScale }]}>
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
                      earned && theme === 'light' && styles.achievementIconCircleEarnedLight,
                    ]}
                  >
                    <Ionicons
                      name={a.icon as any}
                      size={20}
                      color={
                        earned ? (theme === 'dark' ? '#FFFFFF' : '#000000') : theme === 'dark' ? '#9CA3AF' : '#666666'
                      }
                    />
                  </View>
                  <Text style={[styles.achievementTitle, { color: colors.text, fontSize: 13 * textScale }]}>{a.title}</Text>
                  <Text style={[styles.achievementDescription, { color: colors.sub, fontSize: 11 * textScale }]}>
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
            <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * textScale }]}>Próximas sesiones</Text>
              <Text
                style={[styles.sectionLink, { fontSize: 12 * textScale }]}
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
                  <Text style={[styles.sessionType, { color: colors.text, fontSize: 14 * textScale }]}>{s.title}</Text>
                  <Text style={[styles.sessionMeta, { color: colors.sub, fontSize: 12 * textScale }]}>
                    {s.dateLabel} · {s.timeLabel}
                  </Text>
                </View>
                <View style={styles.sessionStatusPill}>
                  <Text style={[styles.sessionStatusText, { fontSize: 11 * textScale }]}>{s.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}


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
    paddingTop: 16,
    paddingBottom: 96,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 96,
    height: 96,
  },
  greetingSection: {
    marginBottom: 16,
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
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(31,41,55,1)',
  },
  profileAvatarLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
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
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  primaryButtonLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  primaryButtonLightNoBorder: {
    backgroundColor: '#E5E7EB',
    borderWidth: 0,
  },
  primaryButtonDarkNoBorder: {
    backgroundColor: '#374151',
    borderWidth: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButtonTextLight: {
    color: '#000000',
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
  highlightCardLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
    borderWidth: 2,
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
  highlightIconLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
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
  nextModuleBadgeLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  nextModuleOrder: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
  nextModuleOrderLight: {
    color: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  achievementIconCircleEarnedLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
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
});
