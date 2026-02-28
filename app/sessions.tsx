/**
 * ============================================================================
 * SESSIONS SCREEN (PANTALLA DE AGENDAMIENTO DE SESIONES)
 * ============================================================================
 * Ubicación: app/sessions.tsx
 * Ruta: /sessions (pantalla independiente)
 * 
 * PROPÓSITO:
 * Esta pantalla permite al usuario proponer sesiones 1:1 con su coach.
 * El flujo es: usuario propone → coach aprueba/modifica → sesión confirmada.
 * 
 * FLUJO DE AGENDAMIENTO:
 * 1. Usuario completa el formulario con fecha, hora y notas opcionales
 * 2. Al enviar, la sesión se crea con status: 'Pendiente'
 * 3. El coach revisa la propuesta en su panel (backend)
 * 4. El coach puede:
 *    - Aprobar: status cambia a 'Confirmada'
 *    - Modificar: sugiere nueva fecha/hora
 *    - Rechazar: elimina la propuesta
 * 5. El usuario ve el status actualizado en "Tus sesiones"
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con botón volver y título
 * 2. Formulario de propuesta:
 *    - Input de fecha (texto libre, ej: "Lunes 20 de marzo")
 *    - Input de hora (texto libre, ej: "18:00h")
 *    - Input de notas opcionales (multiline)
 *    - Botón "Enviar propuesta"
 * 3. Lista de sesiones del usuario:
 *    - Ícono de calendario
 *    - Título, fecha y hora
 *    - Badge de status (Confirmada/Pendiente)
 * 
 * ESTADOS LOCALES:
 * - proposedDate: Fecha propuesta por el usuario
 * - proposedTime: Hora propuesta por el usuario
 * - sessionNotes: Notas opcionales sobre temas a tratar
 * 
 * VALIDACIÓN:
 * - El botón "Enviar propuesta" está deshabilitado si falta fecha u hora
 * - Las notas son opcionales
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a la pantalla anterior
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta theme dark/light
 * - Inputs con minHeight de 44px para touch targets
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - addSession hará POST al backend con la propuesta
 * - El backend notificará al coach sobre la nueva propuesta
 * - El coach podrá aprobar/modificar desde su panel
 * - El usuario recibirá notificación cuando el status cambie
 * - Agregar validación de disponibilidad de horarios
 * - Agregar calendario visual para seleccionar fecha
 * 
 * NOTA: Actualmente los inputs son texto libre. En el futuro se puede
 * agregar un date picker y time picker para mejor UX.
 * ============================================================================
 */

import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useSessions } from '@/contexts/SessionsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function SessionsScreen() {
  const router = useRouter();
  // Obtener sesiones y función para agregar
  const { sessions, addSession } = useSessions();
  // Obtener configuraciones de accesibilidad
  const { theme, largeText, easyReading, noBorders } = useAppSettings();

  // ========== ESTADOS DEL FORMULARIO ==========
  const [proposedDate, setProposedDate] = useState('');   // Fecha propuesta (texto libre)
  const [proposedTime, setProposedTime] = useState('');   // Hora propuesta (texto libre)
  const [sessionNotes, setSessionNotes] = useState('');   // Notas opcionales

  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#4B5563';
  const inputBg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const inputBorder = theme === 'dark' ? '#FFFFFF' : '#000000';

  /**
   * Maneja el envío de la propuesta de sesión
   * Crea una nueva sesión con status 'Pendiente' y limpia el formulario
   */
  const handlePropose = () => {
    // Validar que fecha y hora estén completas
    if (!proposedDate || !proposedTime) return;

    // Crear nueva sesión con status 'Pendiente'
    addSession({
      id: `s-${Date.now()}`,                    // ID único basado en timestamp
      title: 'Sesión 1:1 Propuesta',            // Título por defecto
      dateLabel: proposedDate,                  // Fecha en formato legible
      timeLabel: proposedTime,                  // Hora en formato legible
      status: 'Pendiente',                      // Status inicial
      startISO: new Date().toISOString(),       // Fecha/hora de inicio (placeholder)
      endISO: new Date().toISOString(),         // Fecha/hora de fin (placeholder)
    });

    // Limpiar el formulario después de enviar
    setProposedDate('');
    setProposedTime('');
    setSessionNotes('');
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={[styles.backButton, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.backButtonNoBorder]}
          >
            <Ionicons name="chevron-back" size={20} color={text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: text }, largeText && { fontSize: 22 }]}>Agendar Sesión 1:1</Text>
            <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 16 }]}>
              {easyReading ? 'Propón tu horario.' : 'Propón una fecha y hora. El coach la aprobará o sugerirá cambios.'}
            </Text>
          </View>
        </View>

        <View style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Proponer nueva sesión</Text>
          <Text style={[styles.sectionMeta, { color: sub }]}>
            {easyReading ? 'Elige fecha y hora.' : 'Propón una fecha y hora que te funcione. El coach revisará tu propuesta y la confirmará o sugerirá un horario alternativo.'}
          </Text>

          <Text style={[styles.label, { color: sub }]}>Fecha propuesta</Text>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: text }, noBorders && styles.inputNoBorder]}
            value={proposedDate}
            onChangeText={setProposedDate}
            placeholder="Ej: Lunes 20 de marzo"
            placeholderTextColor="#7C7FA5"
          />

          <Text style={[styles.label, { color: sub }]}>Hora propuesta</Text>
          <TextInput
            style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: text }, noBorders && styles.inputNoBorder]}
            value={proposedTime}
            onChangeText={setProposedTime}
            placeholder="Ej: 18:00h"
            placeholderTextColor="#7C7FA5"
          />

          <Text style={[styles.label, { color: sub }]}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textarea, { backgroundColor: inputBg, borderColor: inputBorder, color: text }, noBorders && styles.inputNoBorder]}
            value={sessionNotes}
            onChangeText={setSessionNotes}
            placeholder="Temas que te gustaría tratar en la sesión..."
            placeholderTextColor="#7C7FA5"
            multiline
            numberOfLines={3}
          />

          <Pressable
            disabled={!proposedDate || !proposedTime}
            style={({ pressed }) => [
              styles.primaryButton,
              (!proposedDate || !proposedTime) && styles.primaryButtonDisabled,
              pressed && proposedDate && proposedTime && { opacity: 0.9 },
            ]}
            onPress={handlePropose}
          >
            <Text style={styles.primaryButtonText}>
              {proposedDate && proposedTime ? 'Enviar propuesta' : 'Completa fecha y hora'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Tus sesiones</Text>

          {/* Si no hay sesiones, mostrar mensaje vacío */}
          {sessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: sub }]}>
              {easyReading ? 'No hay sesiones.' : 'Aún no tienes sesiones agendadas. Propón una fecha arriba.'}
            </Text>
          ) : (
            /* Mapear todas las sesiones del usuario */
            sessions.map((s) => (
              <View key={s.id} style={styles.sessionItem}>
                <View style={[styles.sessionIcon, theme === 'light' && styles.sessionIconLight]}>
                  <Ionicons name="calendar" size={18} color={theme === 'dark' ? ACCENT : '#0F172A'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessionType, { color: text }]}>{s.title}</Text>
                  <Text style={[styles.sessionMeta, { color: sub }]}>
                    {s.dateLabel} · {s.timeLabel}
                  </Text>
                </View>
                <View
                  style={[
                    styles.sessionStatusPill,
                    s.status === 'Confirmada' ? styles.sessionStatusConfirmed : styles.sessionStatusPending,
                    theme === 'light' && styles.sessionStatusLight,
                  ]}
                >
                  <Text style={[styles.sessionStatusText, theme === 'light' && styles.sessionStatusTextLight]}>{s.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  backButtonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', marginBottom: 12 },
  cardLight: { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0, 0, 0, 0.15)' },
  cardNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionMeta: { fontSize: 12, marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 4, marginTop: 8 },
  input: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, minHeight: 44 },
  inputNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: ACCENT, borderRadius: 999, paddingVertical: 10, alignItems: 'center', minHeight: 44, marginTop: 16 },
  primaryButtonDisabled: { backgroundColor: 'rgba(107, 114, 128, 0.4)' },
  primaryButtonText: { color: '#000000', fontWeight: '600', fontSize: 15 },
  sessionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  sessionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sessionIconLight: { backgroundColor: 'rgba(15,23,42,0.04)', borderColor: 'rgba(15,23,42,0.12)', borderWidth: 1 },
  sessionType: { fontSize: 14, fontWeight: '500' },
  sessionMeta: { fontSize: 12 },
  sessionStatusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  sessionStatusLight: { borderColor: 'rgba(15,23,42,0.12)', borderWidth: 1, backgroundColor: 'rgba(15,23,42,0.04)' },
  sessionStatusConfirmed: { backgroundColor: 'rgba(34,197,94,0.15)' },
  sessionStatusPending: { backgroundColor: 'rgba(250,204,21,0.15)' },
  sessionStatusText: { fontSize: 11, fontWeight: '600' },
  sessionStatusTextLight: { color: '#0F172A' },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 16 },
});
