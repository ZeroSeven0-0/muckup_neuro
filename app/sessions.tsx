import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const ACCENT = '#8379CD';

const MOCK_SLOTS = [
  { id: 'slot1', day: 'Jue 14', time: '18:00h' },
  { id: 'slot2', day: 'Vie 15', time: '10:00h' },
  { id: 'slot3', day: 'Lun 18', time: '19:30h' },
  { id: 'slot4', day: 'Mar 19', time: '12:00h' },
];

const MOCK_SESSIONS = [
  {
    id: 's1',
    type: 'Sesión 1: Estrategia',
    dateLabel: 'Jueves 14 de marzo',
    time: '18:00h',
    status: 'Confirmada',
  },
  {
    id: 's2',
    type: 'Sesión 2: Marca profesional',
    dateLabel: 'Viernes 15 de marzo',
    time: '10:00h',
    status: 'Pendiente',
  },
];

export default function SessionsScreen() {
  const router = useRouter();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const { theme, largeText, easyReading } = useAppSettings();
  const isDark = theme === 'dark';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const text = isDark ? '#FFFFFF' : '#000000';
  const sub = isDark ? '#C7C9E8' : '#4B5563';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Pantalla para ver y agendar sesiones de coaching"
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver al dashboard"
            hitSlop={8}
            style={[
              styles.backButton,
              !isDark && { borderColor: '#000000' },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && { fontSize: 22 }]}>Agendar Sesión 1:1</Text>
            <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 16 }]}>
              {easyReading ? 'Reserva tu próxima sesión.' : 'Reserva tu próxima sesión de coaching personalizado.'}
            </Text>
          </View>
        </View>

        {/* Sección agendar nueva sesión */}
        <View style={styles.card}>
          <View style={styles.stepperRow} accessibilityLabel="Progreso para agendar sesión">
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepCircle}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
          </View>
          <Text style={[styles.sectionTitle, { color: text }]}>Selecciona una fecha</Text>
          <Text style={[styles.sectionMeta, { color: sub }]}>
            Elige el día que mejor se adapta a tu ritmo.
          </Text>

          <View style={styles.slotsGrid}>
          {MOCK_SLOTS.map((slot) => {
            const selected = slot.id === selectedSlotId;
              return (
                <Pressable
                  key={slot.id}
                  onPress={() => setSelectedSlotId(slot.id)}
                  style={[
                    styles.slotCard,
                    selected && styles.slotCardSelected,
                  ]}
                  accessibilityRole="button"
                accessibilityLabel={`Seleccionar sesión el ${slot.day} a las ${slot.time}`}
                accessibilityState={{ selected }}
                >
                  <Text style={[styles.slotDay, { color: text }]}>{slot.day}</Text>
                  <Text style={[styles.slotTime, { color: sub }]}>{slot.time}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            disabled={!selectedSlotId}
            style={({ pressed }) => [
              styles.primaryButton,
              !selectedSlotId && styles.primaryButtonDisabled,
              pressed && selectedSlotId && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Confirmar la reserva de la sesión seleccionada"
            accessibilityHint="Confirma la sesión del horario elegido."
          >
            <Text style={styles.primaryButtonText}>
              {selectedSlotId ? 'Confirmar sesión' : 'Selecciona un horario'}
            </Text>
          </Pressable>
        </View>

        {/* Sección próximas sesiones */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: text }]}>Tus próximas sesiones</Text>
          </View>

          {MOCK_SESSIONS.map((s) => (
            <View key={s.id} style={styles.sessionItem}>
              <View style={styles.sessionIcon}>
                <Ionicons name="calendar" size={18} color={ACCENT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionType, { color: text }]}>{s.type}</Text>
                <Text style={[styles.sessionMeta, { color: sub }]}>
                  {s.dateLabel} · {s.time}
                </Text>
              </View>
              <View
                style={[
                  styles.sessionStatusPill,
                  s.status === 'Confirmada' ? styles.sessionStatusConfirmed : styles.sessionStatusPending,
                ]}
              >
                <Text style={styles.sessionStatusText}>{s.status}</Text>
              </View>
            </View>
          ))}
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(225, 228, 243, 0.12)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(225, 228, 243, 0.16)',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionMeta: {
    color: '#C7C9E8',
    fontSize: 12,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(148,163,184,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  stepCircleActive: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(131,121,205,0.3)',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(148,163,184,0.6)',
    marginHorizontal: 4,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  slotCard: {
    width: '47%',
    minHeight: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotCardSelected: {
    borderColor: ACCENT,
    backgroundColor: 'rgba(131,121,205,0.3)',
  },
  slotDay: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  slotTime: {
    color: '#C7C9E8',
    fontSize: 12,
    marginTop: 2,
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(131,121,205,0.4)',
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  sessionStatusConfirmed: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  sessionStatusPending: {
    backgroundColor: 'rgba(250,204,21,0.15)',
  },
  sessionStatusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});
