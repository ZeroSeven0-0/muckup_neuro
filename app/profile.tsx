/**
 * ============================================================================
 * PROFILE SCREEN (PANTALLA DE PERFIL)
 * ============================================================================
 * Ubicación: app/profile.tsx
 * Ruta: /profile (pantalla independiente)
 * 
 * PROPÓSITO:
 * Esta pantalla permite al usuario ver y editar su perfil, configurar
 * accesibilidad, ver sus logros y gestionar denuncias.
 * 
 * TABS DISPONIBLES:
 * 1. Ajustes (settings): Información personal del usuario
 *    - Nombre, bio, email (solo lectura), rol (solo lectura)
 *    - Objetivo profesional, intereses, ubicación, LinkedIn
 *    - Botón "Guardar cambios"
 * 
 * 2. Accesibilidad (accessibility): Configuraciones de accesibilidad
 *    - Tema (Oscuro/Claro)
 *    - Alto contraste (on/off)
 *    - Lectura fácil (on/off) - textos simplificados
 *    - Texto grande (on/off)
 *    - Hápticos (on/off) - vibración al tocar
 *    - Sin bordes (on/off) - elimina bordes de elementos
 * 
 * 3. Logros (achievements): Todos los logros disponibles
 *    - Grid de tarjetas con ícono, título, descripción
 *    - Caja de condición (cómo desbloquear)
 *    - Badge "Obtenido" si está desbloqueado
 *    - Contador de logros obtenidos vs totales
 * 
 * 4. Denuncias (reports): Formulario para reportar problemas
 *    - Tipo de denuncia (dropdown)
 *    - Descripción detallada (textarea)
 *    - Botón "Enviar denuncia"
 * 
 * PARÁMETROS DE URL:
 * - tab: Tab inicial a mostrar (opcional)
 *   - Valores: 'settings', 'accessibility', 'achievements', 'reports'
 *   - Ejemplo: /profile?tab=achievements
 * 
 * ESTADOS LOCALES:
 * - activeTab: Tab actualmente activo
 * - name, bio, goal, interests, location, linkedin: Datos del perfil
 * - email, role: Solo lectura (vienen del backend)
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa a la pantalla anterior
 * - Tabs → Cambia entre secciones
 * - Badge de logros en header → Abre tab de logros
 * 
 * ACCESIBILIDAD:
 * - Soporta todas las configuraciones de accesibilidad
 * - Tabs con accessibilityRole="button"
 * - Switches con accessibilityRole="switch"
 * - Inputs con minHeight de 44px
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - handleSave hará PUT al backend con los datos del perfil
 * - email y role vendrán del backend (solo lectura)
 * - Las configuraciones de accesibilidad se guardarán en el backend
 * - Los logros se calcularán en el backend según el progreso
 * - Las denuncias se enviarán al backend para revisión
 * 
 * CÁLCULO DE LOGROS:
 * Los logros se calculan igual que en achievements.tsx y dashboard.
 * Ver comentarios en esos archivos para más detalles.
 * ============================================================================
 */

import { ACHIEVEMENTS } from '@/constants/b2c-mock';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

const ACCENT = '#6B7280'; // Color de acento: gris medio

// Tipos de tabs disponibles
type TabType = 'settings' | 'accessibility' | 'achievements' | 'reports';

export default function ProfileScreen() {
  const router = useRouter();
  // Obtener parámetro 'tab' de la URL (si existe)
  const params = useLocalSearchParams<{ tab?: string }>();
  const initialTab = (params.tab as TabType) || 'settings';
  
  // Estado del tab activo
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  
  // Obtener configuraciones de accesibilidad y sus setters
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
    noBorders,
    setNoBorders,
  } = useAppSettings();

  // ========== CÁLCULO DE LOGROS DESBLOQUEADOS ==========
  const { modules } = useCourses();
  const completedModules = modules.filter(
    (m) => m.lessons.length > 0 && m.lessons.every((lesson) => lesson.completed)
  );
  const completedLessonsCount = modules.reduce(
    (acc, m) => acc + m.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  const totalModules = modules.length;

  const earnedIds = new Set<string>();
  if (completedModules.length >= 1) earnedIds.add('first_step');
  if (completedModules.length >= 2) earnedIds.add('neuro_impulso_2');
  if (completedModules.length === totalModules && totalModules > 0) {
    earnedIds.add('neuro_impulso_3');
    earnedIds.add('course_complete');
  }
  if (completedLessonsCount >= 3) {
    earnedIds.add('soft_skills_star');
    earnedIds.add('neuro_impulso_1');
  }
  const entrevistasModule = modules.find((m) => m.title.toLowerCase().includes('entrevistas'));
  if (entrevistasModule && entrevistasModule.lessons.every((lesson) => lesson.completed)) {
    earnedIds.add('interview_ready');
  }
  const earnedCount = Array.from(earnedIds).length;

  // ========== ESTADOS DEL PERFIL ==========
  // TODO: Estos datos vendrán del backend cuando el usuario esté autenticado
  const [name, setName] = useState('Alex Estudiante');
  const [bio, setBio] = useState('Estudiante en transición profesional. Buscando roles en producto digital y UX research.');
  const [email] = useState('alex.estudiante@example.com');  // Solo lectura
  const [role] = useState('Estudiante activo');              // Solo lectura
  const [goal, setGoal] = useState('Conseguir un rol de Product Designer junior en los próximos 6 meses.');
  const [interests, setInterests] = useState('UX Research, Diseño de producto, EdTech.');
  const [location, setLocation] = useState('Ciudad de México, MX');
  const [linkedin, setLinkedin] = useState('https://www.linkedin.com/in/tu-perfil');

  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const labelColor = theme === 'dark' ? '#C7C9E8' : '#4B5563';
  const helpColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';
  const inputBg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const inputBorder = theme === 'dark' ? '#FFFFFF' : '#000000';

  /**
   * Guarda los cambios del perfil
   * TODO: Conectar con el backend (FastAPI + Supabase)
   */
  const handleSave = () => {
    // TODO: Hacer PUT al backend con los datos del perfil
  };

  /**
   * Renderiza el contenido según el tab activo
   * Cada tab tiene su propia estructura y funcionalidad
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <View style={styles.form}>
            {/* Formulario de información personal */}
            <Text style={[styles.label, { color: labelColor }]}>Nombre</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: labelColor }]}>Correo (solo lectura)</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={email}
              editable={false}
            />

            <Text style={[styles.label, { color: labelColor }]}>Rol</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={role}
              editable={false}
            />

            <Text style={[styles.label, { color: labelColor }]}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textarea, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuenta brevemente quién eres y qué estás buscando."
              placeholderTextColor="#7C7FA5"
              multiline
              numberOfLines={4}
            />

            <Text style={[styles.label, { color: labelColor }]}>Objetivo profesional</Text>
            <TextInput
              style={[styles.input, styles.textarea, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={goal}
              onChangeText={setGoal}
              placeholder="Ejemplo: transicionar a un rol de datos en el sector salud."
              placeholderTextColor="#7C7FA5"
              multiline
            />

            <Text style={[styles.label, { color: labelColor }]}>Áreas de interés</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={interests}
              onChangeText={setInterests}
              placeholder="Ejemplo: UX, producto, data, etc."
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: labelColor }]}>Ubicación</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ciudad, País"
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: labelColor }]}>LinkedIn</Text>
            <TextInput
              style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textColor }, noBorders && styles.inputNoBorder]}
              value={linkedin}
              onChangeText={setLinkedin}
              placeholder="URL de tu perfil de LinkedIn"
              placeholderTextColor="#7C7FA5"
              autoCapitalize="none"
            />

            <View style={styles.divider} />

            <Text style={[styles.sectionTitle, { color: textColor }, largeText && { fontSize: 18 }]}>Tema</Text>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: labelColor }]}>Tema de la app</Text>
                <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                  {easyReading ? 'Usa oscuro o claro.' : 'Alterna entre modo oscuro e interfaz clara.'}
                </Text>
              </View>
              <Pressable
                onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                hitSlop={8}
                style={[
                  styles.themeToggle,
                  theme === 'light' ? { borderColor: '#000000', backgroundColor: '#FFFFFF' } : { borderColor: '#FFFFFF', backgroundColor: '#000000' },
                  noBorders && styles.themeToggleNoBorder,
                ]}
              >
                <Text style={[styles.themeToggleText, theme === 'light' ? { color: '#000000' } : { color: '#FFFFFF' }, largeText && { fontSize: 14 }]}>
                  {theme === 'dark' ? 'Oscuro' : 'Claro'}
                </Text>
              </Pressable>
            </View>

            <Pressable onPress={handleSave} style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.9 }]}>
              <Text style={styles.primaryButtonText}>Guardar cambios</Text>
            </Pressable>
          </View>
        );

      case 'accessibility':
        return (
          <View style={styles.form}>
            <Text style={[styles.sectionHelp, { color: helpColor }, largeText && { fontSize: 13 }]}>
              {easyReading ? 'Ajusta estas opciones según tus necesidades.' : 'Estas opciones te ayudan a adaptar la experiencia. El lector de pantalla se configura en tu dispositivo.'}
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
              />
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: labelColor }]}>Sin bordes</Text>
                <Text style={[styles.switchHelp, { color: helpColor }, largeText && { fontSize: 12 }]}>
                  {easyReading ? 'Quita bordes de tarjetas.' : 'Elimina los bordes de todas las tarjetas y contenedores.'}
                </Text>
              </View>
              <Switch
                value={noBorders}
                onValueChange={setNoBorders}
                thumbColor={noBorders ? '#FFFFFF' : '#6B7280'}
                trackColor={{ false: '#4B5563', true: ACCENT }}
              />
            </View>
          </View>
        );

      case 'achievements':
        return (
          <View style={styles.form}>
            <Text style={[styles.sectionHelp, { color: helpColor }, largeText && { fontSize: 13 }]}>
              Has desbloqueado {earnedCount} de {ACHIEVEMENTS.length} badges.
            </Text>

            <View style={styles.achievementsGrid}>
              {ACHIEVEMENTS.map((a) => {
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
                  >
                    <View style={styles.iconCircle}>
                      <Ionicons name={a.icon as any} size={20} color={earned ? '#FFFFFF' : theme === 'dark' ? '#9CA3AF' : '#64748B'} />
                    </View>
                    <Text style={[styles.achievementTitle, { color: textColor }]}>{a.title}</Text>
                    <Text style={[styles.achievementDesc, { color: labelColor }]}>
                      {a.description}
                    </Text>

                    <View style={[styles.conditionBox, theme === 'light' && styles.conditionBoxLight, noBorders && styles.conditionBoxNoBorder]}>
                      <Text style={[styles.conditionLabel, { color: labelColor }]}>Condición</Text>
                      <Text style={[styles.conditionText, { color: textColor }]}>{a.condition}</Text>
                    </View>

                    {earned && (
                      <View style={styles.earnedPill}>
                        <Text style={styles.earnedPillText}>Obtenido</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        );

      case 'reports':
        return (
          <View style={styles.form}>
            <View style={[styles.comingSoonBox, theme === 'light' && styles.comingSoonBoxLight, noBorders && styles.comingSoonBoxNoBorder]}>
              <Ionicons name="megaphone-outline" size={48} color={theme === 'dark' ? ACCENT : '#0F172A'} />
              <Text style={[styles.comingSoonTitle, { color: textColor }, largeText && { fontSize: 20 }]}>Próximamente</Text>
              <Text style={[styles.comingSoonText, { color: helpColor }, largeText && { fontSize: 14 }]}>
                Estamos trabajando en un canal de denuncias seguro y confidencial para reportar cualquier situación inapropiada.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.backButton, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.buttonNoBorder]}>
            <Ionicons name="chevron-back" size={20} color={textColor} />
          </Pressable>
          <Text style={[styles.title, { color: textColor }, largeText && { fontSize: 24 }]}>Tu perfil</Text>
          <Pressable onPress={() => setActiveTab('achievements')} hitSlop={8} style={[styles.achievementsBadge, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.buttonNoBorder]}>
            <Ionicons name="trophy" size={16} color={textColor} />
            <Text style={[styles.achievementsBadgeText, { color: textColor }]}>{earnedCount}</Text>
          </Pressable>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, noBorders && styles.avatarCircleNoBorder]}>
            <Ionicons name="person" size={40} color="#9CA3AF" />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable onPress={() => setActiveTab('settings')} style={[styles.tab, activeTab === 'settings' && styles.tabActive, noBorders && activeTab === 'settings' && styles.tabActiveNoBorder]}>
            <Ionicons name="settings-outline" size={20} color={activeTab === 'settings' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'settings' ? textColor : helpColor }]}>Ajustes</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('accessibility')} style={[styles.tab, activeTab === 'accessibility' && styles.tabActive, noBorders && activeTab === 'accessibility' && styles.tabActiveNoBorder]}>
            <Ionicons name="eye-outline" size={20} color={activeTab === 'accessibility' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'accessibility' ? textColor : helpColor }]}>Accesibilidad</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('achievements')} style={[styles.tab, activeTab === 'achievements' && styles.tabActive, noBorders && activeTab === 'achievements' && styles.tabActiveNoBorder]}>
            <Ionicons name="trophy-outline" size={20} color={activeTab === 'achievements' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'achievements' ? textColor : helpColor }]}>Logros</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('reports')} style={[styles.tab, activeTab === 'reports' && styles.tabActive, noBorders && activeTab === 'reports' && styles.tabActiveNoBorder]}>
            <Ionicons name="megaphone-outline" size={20} color={activeTab === 'reports' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'reports' ? textColor : helpColor }]}>Denuncias</Text>
          </Pressable>
        </View>

        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  achievementsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(107, 114, 128, 0.2)' },
  achievementsBadgeText: { fontSize: 12, fontWeight: '700' },
  buttonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700' },
  avatarWrapper: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: ACCENT, backgroundColor: 'rgba(31,41,55,1)', justifyContent: 'center', alignItems: 'center' },
  avatarCircleNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  tabsContainer: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  tabActive: { backgroundColor: 'rgba(107, 114, 128, 0.3)', borderWidth: 1, borderColor: ACCENT },
  tabActiveNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  tabText: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  form: { gap: 12 },
  label: { fontSize: 13 },
  input: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, minHeight: 44 },
  inputNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  inputDisabled: { opacity: 0.7 },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  primaryButton: { backgroundColor: ACCENT, borderRadius: 999, paddingVertical: 10, alignItems: 'center', minHeight: 44, marginTop: 8 },
  primaryButtonText: { color: '#000000', fontWeight: '600', fontSize: 15 },
  secondaryButton: { borderRadius: 999, borderWidth: 1, borderColor: ACCENT, paddingVertical: 10, alignItems: 'center', minHeight: 44 },
  secondaryButtonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  secondaryButtonText: { fontWeight: '600', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionHelp: { fontSize: 12, marginBottom: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 },
  switchHelp: { fontSize: 11 },
  divider: { height: 1, backgroundColor: 'rgba(148,163,184,0.4)', marginVertical: 12 },
  themeToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  themeToggleNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  themeToggleText: { fontSize: 13 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  achievementCard: { width: '47%', borderRadius: 16, padding: 12, backgroundColor: 'rgba(15,23,42,0.9)', borderWidth: 1, borderColor: 'rgba(31,41,55,1)' },
  achievementCardLight: { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(15,23,42,0.12)' },
  achievementCardLocked: { opacity: 0.6 },
  achievementCardNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(107, 114, 128, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  achievementTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  achievementDesc: { fontSize: 11 },
  conditionBox: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginTop: 10,
    marginBottom: 10,
  },
  conditionBoxLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: 'rgba(15,23,42,0.12)',
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
  earnedPillText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
  },
  comingSoonBox: { alignItems: 'center', padding: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  comingSoonBoxLight: { backgroundColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(15,23,42,0.12)' },
  comingSoonBoxNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  comingSoonTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  comingSoonText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
