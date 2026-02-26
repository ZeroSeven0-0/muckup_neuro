import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#8379CD';

export default function MiRutaScreen() {
  const router = useRouter();
  const { theme, largeText, easyReading } = useAppSettings();
  const { modules } = useCourses();
  const isDark = theme === 'dark';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#000000';
  const sub = text;

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
          {easyReading ? 'Avanza a tu ritmo.' : 'Avanza módulo a módulo. Todo está diseñado para ir a tu ritmo.'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="scrollview"
      >
        {modules.map((module) => {
          const nextLesson = module.lessons.find((l) => !l.completed);
          const completedCount = module.lessons.filter((lesson) => lesson.completed).length;
          const progressPercent = module.lessons.length
            ? Math.round((completedCount / module.lessons.length) * 100)
            : 0;
          const videoCount = module.lessons.filter((lesson) => lesson.mediaType === 'video').length;
          const podcastCount = module.lessons.filter((lesson) => lesson.mediaType === 'podcast').length;

          return (
            <View
              key={module.id}
              style={styles.card}
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
                      ~ {nextLesson.durationMinutes} min · {nextLesson.mediaType === 'video' ? 'Video corto' : 'Podcast corto'}
                    </Text>
                  </View>
                  {/* Botón de acceso único a la lista de lecciones */}
                </View>
              ) : (
                <Text style={[styles.completedText, { color: text }, largeText && { fontSize: 13 }]}>
                  Módulo completado. Revisa tus logros en el panel de progreso.
                </Text>
              )}
              <Pressable
                style={styles.secondaryPill}
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
    backgroundColor: 'rgba(225, 228, 243, 0.12)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 228, 243, 0.16)',
    marginBottom: 12,
  },
  cardLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
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
    backgroundColor: 'rgba(131,121,205,0.3)',
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
    backgroundColor: 'rgba(131, 121, 205, 0.25)',
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
