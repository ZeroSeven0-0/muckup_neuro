import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const courseId = Array.isArray(id) ? id[0] : id;
  const { modules, completeLesson } = useCourses();
  const { theme, largeText, easyReading } = useAppSettings();
  const isDark = theme === 'dark';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#000000';
  const sub = text;

  const module = modules.find((m) => m.id === courseId);
  const [liveMessage, setLiveMessage] = useState('');

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

  const completedCount = module.lessons.filter((lesson) => lesson.completed).length;
  const progressPercent = module.lessons.length
    ? Math.round((completedCount / module.lessons.length) * 100)
    : 0;

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
        <View style={{ flex: 1 }}>
          <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && { fontSize: 22 }]}>{module.title}</Text>
          <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 15 }]}>
            {easyReading ? 'Lista de lecciones cortas.' : module.description}
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
        <Text accessibilityLiveRegion="polite" style={styles.srOnly}>{liveMessage}</Text>
        {module.lessons.map((lesson, idx) => (
          <View
            key={lesson.id}
            style={styles.lessonCard}
            accessible
            accessibilityLabel={`Lección ${idx + 1} de ${module.lessons.length}. ${lesson.title}. ${lesson.mediaType === 'video' ? 'Video' : 'Podcast'}. ${lesson.durationMinutes} minutos. ${lesson.completed ? 'Completado' : 'Pendiente'}.`}
          >
            <View style={styles.lessonHeader}>
              <View style={styles.lessonIcon}>
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
                  {lesson.mediaType === 'video' ? 'Video' : 'Podcast'} · {lesson.durationMinutes} min
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
            <Text
              style={[styles.sectionText, { color: text }]}
              numberOfLines={easyReading ? 2 : undefined}
            >
              {lesson.transcript}
            </Text>

            <View style={styles.actionsRow}>
              <Pressable
                style={styles.linkButton}
                accessibilityRole="button"
                accessibilityLabel={`Abrir enlace del ${lesson.mediaType === 'video' ? 'video' : 'podcast'} ${lesson.title}`}
                accessibilityHint="Se abrirá el contenido en el navegador o app correspondiente."
                onPress={() => Linking.openURL(lesson.mediaUrl)}
              >
                <Text style={[styles.linkButtonText, { color: text }]}>Abrir enlace</Text>
              </Pressable>
              <Pressable
                style={[styles.completeButton, lesson.completed && styles.completeButtonDisabled]}
                accessibilityRole="button"
                accessibilityLabel={`Marcar como completado ${lesson.title}`}
                accessibilityHint="Actualiza tu progreso del curso."
                onPress={() => {
                  if (!lesson.completed) {
                    const newCompleted = completedCount + 1;
                    const newPercent = module.lessons.length ? Math.round((newCompleted / module.lessons.length) * 100) : 0;
                    setLiveMessage(`Progreso actualizado al ${newPercent} por ciento.`);
                    completeLesson(module.id, lesson.id);
                  }
                }}
                disabled={lesson.completed}
              >
                <Text style={styles.completeButtonText}>
                  {lesson.completed ? 'Listo' : 'Marcar completado'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    backgroundColor: 'rgba(131, 121, 205, 0.25)',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: '#8379CD',
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
    borderColor: 'rgba(225, 228, 243, 0.16)',
    backgroundColor: 'rgba(225, 228, 243, 0.12)',
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
    borderColor: 'rgba(131,121,205,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#8379CD',
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
    borderColor: '#8379CD',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 40,
    justifyContent: 'center',
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#8379CD',
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
