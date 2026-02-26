import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const ACCENT = '#8379CD';

export default function AchievementsScreen() {
  const router = useRouter();
  const { theme, highContrast, largeText, easyReading } = useAppSettings();

  // Mock: algunos logros “ganados”
  const earnedIds = new Set(['first_step', 'cv_master', 'linkedin_pro', 'neuro_impulso_1', 'job_hunter']);

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
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && styles.titleLarge]}>
              Tus Logros
            </Text>
            <Text style={[styles.subtitle, { color: sub }, largeText && styles.subtitleLarge]}>
              Revisa tus badges, puntos y las condiciones exactas para desbloquear cada logro.
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: sub }]}>
            {Array.from(earnedIds).length} de {ACHIEVEMENTS.length} badges
          </Text>
        </View>

        <View style={styles.grid}>
          {ACHIEVEMENTS.map((a) => {
            const earned = earnedIds.has(a.id);
            return (
              <View
                key={a.id}
                style={[
                  styles.card,
                  !earned && styles.cardLocked,
                  theme === 'light' && styles.cardLight,
                  highContrast && styles.cardHC,
                ]}
                accessibilityLabel={`${a.title}. ${earned ? 'Obtenido' : 'No obtenido'}. ${a.points} puntos. Condición: ${a.condition}`}
              >
                <View style={styles.iconCircle}>
                  <Ionicons
                    name={a.icon as any}
                    size={20}
                    color={earned ? '#FFFFFF' : theme === 'dark' ? '#9CA3AF' : '#64748B'}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: text }]}>{a.title}</Text>
                <Text style={[styles.cardDesc, { color: sub }]} numberOfLines={easyReading ? 2 : undefined}>
                  {a.description}
                </Text>

                <View style={[styles.conditionBox, theme === 'light' && styles.conditionBoxLight]}>
                  <Text style={[styles.conditionLabel, { color: sub }]}>Condición</Text>
                  <Text style={[styles.conditionText, { color: text }]}>{a.condition}</Text>
                </View>

                <View style={styles.pointsRow}>
                  <Ionicons name="ribbon" size={14} color={theme === 'dark' ? '#9CA3AF' : '#64748B'} />
                  <Text style={[styles.pointsText, { color: sub }]}>{a.points} pts</Text>
                  {earned && (
                    <View style={styles.earnedPill}>
                      <Text style={styles.earnedPillText}>Obtenido</Text>
                    </View>
                  )}
                </View>
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
  cardLocked: { opacity: 0.65 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(131,121,205,0.2)',
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
  conditionLabel: { fontSize: 10, marginBottom: 4 },
  conditionText: { fontSize: 11, fontWeight: '600' },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: { fontSize: 11, fontWeight: '600' },
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
