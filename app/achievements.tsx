import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { getEarnedAchievements } from '@/utils/achievements';

const ACCENT = '#6B7280';

export default function AchievementsScreen() {
  const router = useRouter();
  const { theme, highContrast, textScale, easyReading, noBorders } = useAppSettings();

  const { modules } = useCourses();
  const { earnedIds } = getEarnedAchievements(modules);
  
  const colors = getThemeColors(theme);

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.gradient, { backgroundColor: colors.bg }]} />
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Logo */}
        <View style={styles.topBar}>
          <Image 
            source={theme === 'dark' 
              ? require('@/assets/images/logo.png')
              : require('@/assets/images/logo-light.png')
            }
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Logotipo Neurogestión"
          />
        </View>
        
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
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: 22 * textScale }]}>
              Tus Logros
            </Text>
            <Text style={[styles.subtitle, { color: colors.sub, fontSize: 14 * textScale }]}>
              {easyReading ? 'Revisa tus logros y cómo conseguirlos.' : 'Revisa todos tus logros desbloqueados y las condiciones específicas para desbloquear cada uno de los badges disponibles.'}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: colors.sub, fontSize: 12 * textScale }]}>
            {Array.from(earnedIds).length} de {ACHIEVEMENTS.length} logros
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
                  noBorders && styles.cardNoBorder,
                ]}
                accessibilityLabel={`${a.title}. ${earned ? 'Obtenido' : 'No obtenido'}. Condición: ${a.condition}`}
              >
                <View style={[
                  styles.iconCircle,
                  theme === 'light' && styles.iconCircleLight,
                  earned && theme === 'light' && styles.iconCircleEarnedLight,
                ]}>
                  <Ionicons
                    name={a.icon as any}
                    size={20}
                    color={earned ? (theme === 'dark' ? '#FFFFFF' : '#000000') : (theme === 'dark' ? '#9CA3AF' : '#666666')}
                  />
                </View>
                <Text style={[styles.cardTitle, { color: colors.text, fontSize: 13 * textScale }]}>{a.title}</Text>
                <Text style={[styles.cardDesc, { color: colors.sub, fontSize: 11 * textScale }]}>
                  {a.description}
                </Text>

                <View style={[styles.conditionBox, theme === 'light' && styles.conditionBoxLight, noBorders && styles.conditionBoxNoBorder]}>
                  <Text style={[styles.conditionLabel, { color: colors.sub, fontSize: 10 * textScale }]}>Condición</Text>
                  <Text style={[styles.conditionText, { color: colors.text, fontSize: 11 * textScale }]}>{a.condition}</Text>
                </View>

                {earned && (
                  <View style={[styles.earnedPill, theme === 'light' && styles.earnedPillLight]}>
                    <Text style={[styles.earnedPillText, { fontSize: 10 * textScale }, theme === 'light' && styles.earnedPillTextLight]}>Obtenido</Text>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  topBar: {
    marginBottom: 8,
  },
  logo: {
    width: 96,
    height: 96,
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
  subtitle: { fontSize: 14, marginTop: 4 },
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
  iconCircleLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  iconCircleEarnedLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
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
  earnedPillLight: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#000000',
  },
  earnedPillText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  earnedPillTextLight: {
    color: '#FFFFFF',
  },
});
