import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

const ACCENT = '#8379CD';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    theme,
    setTheme,
    highContrast,
    setHighContrast,
    easyReading,
    setEasyReading,
    largeText,
    setLargeText,
    haptics,
    setHaptics,
  } = useAppSettings();

  const earnedIds = new Set(['first_step', 'cv_master', 'linkedin_pro', 'neuro_impulso_1', 'job_hunter']);
  const earnedCount = Array.from(earnedIds).length;

  // Datos mock de perfil por ahora
  const [name, setName] = useState('Alex Estudiante');
  const [bio, setBio] = useState(
    'Estudiante en transición profesional. Buscando roles en producto digital y UX research.'
  );
  const [email] = useState('alex.estudiante@example.com');
  const [role] = useState('Estudiante activo');
  const [goal, setGoal] = useState('Conseguir un rol de Product Designer junior en los próximos 6 meses.');
  const [interests, setInterests] = useState('UX Research, Diseño de producto, EdTech.');
  const [location, setLocation] = useState('Ciudad de México, MX');
  const [linkedin, setLinkedin] = useState('https://www.linkedin.com/in/tu-perfil');

  const handleSave = () => {
    // Aquí luego se conectará con FastAPI/Supabase para guardar el perfil.
  };

  const isDark = theme === 'dark';
  const bg = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const labelColor = isDark ? '#C7C9E8' : '#4B5563';
  const helpColor = isDark ? '#9CA3AF' : '#6B7280';
  const inputBg = isDark ? '#000000' : '#FFFFFF';
  const inputBorder = isDark ? '#FFFFFF' : '#000000';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Pantalla de perfil de usuario"
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            style={[
              styles.backButton,
              theme === 'light' && { borderColor: '#000000' },
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={theme === 'light' ? '#000000' : '#FFFFFF'}
            />
          </Pressable>
          <Text
            style={[
              styles.title,
              theme === 'light' && styles.titleLight,
              { color: textColor },
              largeText && { fontSize: 24 },
            ]}
            accessibilityRole="header"
          >
            Tu perfil
          </Text>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#9CA3AF" />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: labelColor }]}>Nombre</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar nombre"
          />

          <Text style={[styles.label, { color: labelColor }]}>Correo (solo lectura)</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputDisabled,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={email}
            editable={false}
            accessibilityLabel="Correo electrónico asociado a tu cuenta"
          />

          <Text style={[styles.label, { color: labelColor }]}>Rol</Text>
          <TextInput
            style={[
              styles.input,
              styles.inputDisabled,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={role}
            editable={false}
            accessibilityLabel="Rol actual en el programa"
          />

          <Text style={[styles.label, { color: labelColor }]}>Biografía</Text>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={bio}
            onChangeText={setBio}
            placeholder="Cuenta brevemente quién eres y qué estás buscando."
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar biografía"
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: labelColor }]}>Objetivo profesional</Text>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={goal}
            onChangeText={setGoal}
            placeholder="Ejemplo: transicionar a un rol de datos en el sector salud."
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar objetivo profesional"
            multiline
          />

          <Text style={[styles.label, { color: labelColor }]}>Áreas de interés</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={interests}
            onChangeText={setInterests}
            placeholder="Ejemplo: UX, producto, data, etc."
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar áreas de interés"
          />

          <Text style={[styles.label, { color: labelColor }]}>Ubicación</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Ciudad, País"
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar ubicación"
          />

          <Text style={[styles.label, { color: labelColor }]}>LinkedIn</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
            ]}
            value={linkedin}
            onChangeText={setLinkedin}
            placeholder="URL de tu perfil de LinkedIn"
            placeholderTextColor="#7C7FA5"
            accessibilityLabel="Editar enlace a LinkedIn"
            autoCapitalize="none"
          />

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: textColor }, largeText && { fontSize: 18 }]}>
            Tema y accesibilidad
          </Text>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: labelColor }]}>Tema de la app</Text>
              <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                {easyReading ? 'Usa oscuro o claro.' : 'Alterna entre modo oscuro e interfaz clara.'}
              </Text>
            </View>
            <Pressable
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              accessibilityRole="button"
              accessibilityLabel="Cambiar entre modo claro y oscuro"
              hitSlop={8}
              style={[
                styles.themeToggle,
                theme === 'light'
                  ? { borderColor: '#000000', backgroundColor: '#FFFFFF' }
                  : { borderColor: '#FFFFFF', backgroundColor: '#000000' },
              ]}
            >
              <Text
                style={[
                  styles.themeToggleText,
                  theme === 'light' ? { color: '#000000' } : { color: '#FFFFFF' },
                  largeText && { fontSize: 14 },
                ]}
              >
                {theme === 'dark' ? 'Oscuro' : 'Claro'}
              </Text>
            </Pressable>
          </View>

          <Text style={[styles.sectionHelp, { color: helpColor }, largeText && { fontSize: 13 }]}>
            {easyReading
              ? 'Ajusta estas opciones según tus necesidades.'
              : 'Estas opciones te ayudan a adaptar la experiencia. El lector de pantalla se configura en tu dispositivo.'}
          </Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: labelColor }]}>Modo alto contraste</Text>
              <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                {easyReading ? 'Aumenta contraste.' : 'Potencia colores y contornos para mejorar la visibilidad.'}
              </Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              thumbColor={highContrast ? '#FFFFFF' : '#6B7280'}
              trackColor={{ false: '#4B5563', true: ACCENT }}
              accessibilityLabel="Activar o desactivar modo alto contraste"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: labelColor }]}>Lectura fácil</Text>
              <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                {easyReading ? 'Reduce textos.' : 'Simplifica textos técnicos y descripciones largas.'}
              </Text>
            </View>
            <Switch
              value={easyReading}
              onValueChange={setEasyReading}
              thumbColor={easyReading ? '#FFFFFF' : '#6B7280'}
              trackColor={{ false: '#4B5563', true: ACCENT }}
              accessibilityLabel="Activar o desactivar modo lectura fácil"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: labelColor }]}>Texto grande</Text>
              <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                {easyReading ? 'Texto más grande.' : 'Aumenta el tamaño de la tipografía en toda la app.'}
              </Text>
            </View>
            <Switch
              value={largeText}
              onValueChange={setLargeText}
              thumbColor={largeText ? '#FFFFFF' : '#6B7280'}
              trackColor={{ false: '#4B5563', true: ACCENT }}
              accessibilityLabel="Activar o desactivar texto grande"
            />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: labelColor }]}>Feedback háptico</Text>
              <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                {easyReading ? 'Vibración leve.' : 'Activa pequeñas vibraciones al completar acciones clave.'}
              </Text>
            </View>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              thumbColor={haptics ? '#FFFFFF' : '#6B7280'}
              trackColor={{ false: '#4B5563', true: ACCENT }}
              accessibilityLabel="Activar o desactivar feedback háptico"
            />
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: textColor }, largeText && { fontSize: 18 }]}>Tus logros</Text>
          <Text style={[styles.sectionHelp, { color: helpColor }, largeText && { fontSize: 13 }]}>
            Has desbloqueado {earnedCount} de {ACHIEVEMENTS.length} badges. Puedes ver todos los
            logros, puntos y condiciones de desbloqueo.
          </Text>
          <Pressable
            onPress={() => router.push('/achievements')}
            style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel="Ver todos tus logros"
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: isDark ? '#FFFFFF' : '#000000' },
              ]}
            >
              Ver logros
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios de perfil"
          >
            <Text style={styles.primaryButtonText}>Guardar cambios</Text>
          </Pressable>
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
    paddingBottom: 24,
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  titleLight: {
    color: '#020617',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: ACCENT,
    backgroundColor: 'rgba(31,41,55,1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    gap: 12,
  },
  label: {
    color: '#C7C9E8',
    fontSize: 13,
  },
  input: {
    backgroundColor: 'rgba(5, 5, 20, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(225, 228, 243, 0.2)',
    color: '#FFFFFF',
    minHeight: 44,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ACCENT,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionHelp: {
    color: '#C7C9E8',
    fontSize: 12,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  switchHelp: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 12,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.8)',
  },
  themeToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
});
