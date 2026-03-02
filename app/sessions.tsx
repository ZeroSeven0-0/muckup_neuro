/**
 * ============================================================================
 * SESSIONS SCREEN (PANTALLA DE SESIONES 1:1)
 * ============================================================================
 * Ubicación: app/sessions.tsx
 * Ruta: /sessions (pantalla independiente)
 * 
 * PROPÓSITO:
 * Esta pantalla permite al usuario proponer nuevas sesiones 1:1 con su coach
 * y ver todas sus sesiones agendadas (confirmadas, pendientes o con cambios).
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con botón volver, título y descripción
 * 2. Formulario para proponer nueva sesión:
 *    - Input de fecha propuesta (texto libre)
 *    - Input de hora propuesta (texto libre)
 *    - Input de notas opcionales (textarea)
 *    - Botón "Enviar propuesta"
 * 3. Lista de sesiones agendadas:
 *    - Título de la sesión
 *    - Fecha y hora
 *    - Estado (Confirmada, Pendiente, Cambio sugerido)
 *    - Ícono de calendario
 * 
 * FLUJO DE PROPUESTA:
 * 1. Usuario completa fecha y hora (obligatorios)
 * 2. Opcionalmente agrega notas sobre temas a tratar
 * 3. Al presionar "Enviar propuesta", se llama a handlePropose()
 * 4. Se crea una nueva sesión con estado "Pendiente"
 * 5. Se limpia el formulario
 * 6. La sesión aparece en la lista de sesiones
 * 
 * ESTADOS DE SESIÓN:
 * - "Confirmada": El coach aprobó la fecha y hora
 * - "Pendiente": Esperando aprobación del coach
 * - "Cambio sugerido": El coach propuso otra fecha/hora
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a la pantalla anterior
 * - También accesible desde /(tabs)/agenda
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta theme dark/light
 * - Inputs con minHeight de 44px
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - handlePropose hará POST al backend con la propuesta
 * - El coach recibirá notificación de la propuesta
 * - El backend actualizará el estado de la sesión
 * - Las sesiones se sincronizarán en tiempo real
 * ============================================================================
 */

import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useSessions } from '@/contexts/SessionsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function SessionsScreen() {
  // ========== HOOKS Y CONTEXTOS ==========
  const router = useRouter();
  
  // Obtener sesiones y función para agregar nuevas sesiones
  const { sessions, addSession } = useSessions();
  
  // Configuración de accesibilidad y tema
  const { theme, textScale, easyReading, noBorders } = useAppSettings();

  // ========== ESTADOS DEL FORMULARIO ==========
  // Fecha propuesta por el usuario (texto libre, ej: "Lunes 20 de marzo")
  const [proposedDate, setProposedDate] = useState('');
  
  // Hora propuesta por el usuario (texto libre, ej: "18:00h")
  const [proposedTime, setProposedTime] = useState('');
  
  // Notas opcionales sobre temas a tratar en la sesión
  const [sessionNotes, setSessionNotes] = useState('');

  // Estilos globales
  const commonStyles = getCommonStyles(theme, noBorders);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);

  /**
   * Maneja el envío de una propuesta de sesión
   * Crea una nueva sesión con estado "Pendiente" y limpia el formulario
   * TODO: Conectar con el backend para enviar la propuesta al coach
   */
  const handlePropose = () => {
    // Validar que fecha y hora estén completos
    if (!proposedDate || !proposedTime) return;

    // Crear nueva sesión con ID único basado en timestamp
    addSession({
      id: `s-${Date.now()}`,
      title: 'Sesión 1:1 Propuesta',
      dateLabel: proposedDate,
      timeLabel: proposedTime,
      status: 'Pendiente',
      notes: sessionNotes || undefined,
    });

    // Limpiar el formulario después de enviar
    setProposedDate('');
    setProposedTime('');
    setSessionNotes('');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        {/* Header con logotipo */}
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
            hitSlop={8}
            style={[styles.backButton, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.backButtonNoBorder]}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.text, fontSize: 22 * textScale }]}>Agendar Sesión 1:1</Text>
            <Text style={[styles.subtitle, { color: colors.sub, fontSize: 14 * textScale }]}>
              {easyReading ? 'Propón tu horario.' : 'Propón una fecha y hora. El coach la aprobará o sugerirá cambios.'}
            </Text>
          </View>
        </View>

        <View style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * textScale }]}>Proponer nueva sesión</Text>
          <Text style={[styles.sectionMeta, { color: colors.sub, fontSize: 12 * textScale }]}>
            {easyReading ? 'Elige fecha y hora.' : 'Propón una fecha y hora que te funcione. El coach revisará tu propuesta y la confirmará o sugerirá un horario alternativo.'}
          </Text>

          <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Fecha propuesta</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
            value={proposedDate}
            onChangeText={setProposedDate}
            placeholder="Ej: Lunes 20 de marzo"
            placeholderTextColor="#7C7FA5"
          />

          <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Hora propuesta</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
            value={proposedTime}
            onChangeText={setProposedTime}
            placeholder="Ej: 18:00h"
            placeholderTextColor="#7C7FA5"
          />

          <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Notas (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textarea, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
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
              theme === 'light' && styles.primaryButtonLight,
              theme === 'light' && noBorders && styles.primaryButtonLightNoBorder,
              theme === 'dark' && noBorders && styles.primaryButtonDarkNoBorder,
              (!proposedDate || !proposedTime) && styles.primaryButtonDisabled,
              pressed && proposedDate && proposedTime && { opacity: 0.9 },
            ]}
            onPress={handlePropose}
          >
            <Text style={[styles.primaryButtonText, { fontSize: 15 * textScale }, theme === 'light' && styles.primaryButtonTextLight]}>
              {proposedDate && proposedTime ? 'Enviar propuesta' : 'Completa fecha y hora'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, theme === 'light' && styles.cardLight, noBorders && styles.cardNoBorder]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: 16 * textScale }]}>Tus sesiones</Text>

          {sessions.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.sub, fontSize: 13 * textScale }]}>
              {easyReading ? 'No hay sesiones.' : 'Aún no tienes sesiones agendadas. Propón una fecha arriba.'}
            </Text>
          ) : (
            sessions.map((s) => (
              <View key={s.id} style={styles.sessionItem}>
                <View style={[styles.sessionIcon, theme === 'light' && styles.sessionIconLight, noBorders && styles.sessionIconNoBorder]}>
                  <Ionicons name="calendar" size={18} color={theme === 'dark' ? ACCENT : '#0F172A'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sessionType, { color: colors.text, fontSize: 14 * textScale }]}>{s.title}</Text>
                  <Text style={[styles.sessionMeta, { color: colors.sub, fontSize: 12 * textScale }]}>
                    {s.dateLabel} · {s.timeLabel}
                  </Text>
                </View>
                <View
                  style={[
                    styles.sessionStatusPill,
                    s.status === 'Confirmada'
                      ? styles.sessionStatusConfirmed
                      : s.status === 'Cambio sugerido'
                        ? styles.sessionStatusChange
                        : styles.sessionStatusPending,
                    theme === 'light' && styles.sessionStatusLight,
                    noBorders && styles.sessionStatusNoBorder,
                  ]}
                >
                  <Text style={[styles.sessionStatusText, theme === 'light' && styles.sessionStatusTextLight, { fontSize: 11 * textScale }]}>{s.status}</Text>
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  topBar: { marginBottom: 8 },
  logo: { width: 96, height: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  backButtonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 8, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', marginBottom: 12 },
  cardLight: { backgroundColor: '#FFFFFF', borderColor: '#000000' },
  cardNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionMeta: { fontSize: 12, marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 4, marginTop: 8 },
  input: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, minHeight: 44 },
  inputNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: '#000000', borderRadius: 999, paddingVertical: 10, alignItems: 'center', minHeight: 44, marginTop: 16, borderWidth: 2, borderColor: '#FFFFFF' },
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
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  primaryButtonTextLight: {
    color: '#000000',
  },
  sessionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  sessionIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sessionIconLight: { backgroundColor: '#FFFFFF', borderColor: '#000000', borderWidth: 1 },
  sessionIconNoBorder: { borderWidth: 0 },
  sessionType: { fontSize: 14, fontWeight: '500' },
  sessionMeta: { fontSize: 12 },
  sessionStatusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  sessionStatusNoBorder: { borderWidth: 0 },
  sessionStatusLight: { borderColor: '#000000', borderWidth: 1, backgroundColor: '#FFFFFF' },
  sessionStatusConfirmed: { backgroundColor: 'rgba(34,197,94,0.15)' },
  sessionStatusPending: { backgroundColor: 'rgba(250,204,21,0.15)' },
  sessionStatusChange: { backgroundColor: 'rgba(239,68,68,0.15)' },
  sessionStatusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  sessionStatusTextLight: { color: '#0F172A' },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 16 },
});
