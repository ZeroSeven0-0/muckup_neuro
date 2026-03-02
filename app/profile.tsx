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
import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

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
    textScale,
    setTextScale,
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

  // Estilos globales
  const commonStyles = getCommonStyles(theme, noBorders);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);
  const helpColor = theme === 'dark' ? '#9CA3AF' : '#6B7280';

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
            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Nombre</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Correo (solo lectura)</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={email}
              editable={false}
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Rol</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={role}
              editable={false}
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textarea, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuenta brevemente quién eres y qué estás buscando."
              placeholderTextColor="#7C7FA5"
              multiline
              numberOfLines={4}
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Objetivo profesional</Text>
            <TextInput
              style={[styles.input, styles.textarea, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={goal}
              onChangeText={setGoal}
              placeholder="Ejemplo: transicionar a un rol de datos en el sector salud."
              placeholderTextColor="#7C7FA5"
              multiline
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Áreas de interés</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={interests}
              onChangeText={setInterests}
              placeholder="Ejemplo: UX, producto, data, etc."
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Ubicación</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ciudad, País"
              placeholderTextColor="#7C7FA5"
            />

            <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>LinkedIn</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text, fontSize: 16 * textScale }, noBorders && styles.inputNoBorder]}
              value={linkedin}
              onChangeText={setLinkedin}
              placeholder="URL de tu perfil de LinkedIn"
              placeholderTextColor="#7C7FA5"
              autoCapitalize="none"
            />

            <Pressable onPress={handleSave} style={({ pressed }) => [
              styles.primaryButton, 
              theme === 'light' && styles.primaryButtonLight,
              theme === 'light' && noBorders && styles.primaryButtonLightNoBorder,
              theme === 'dark' && noBorders && styles.primaryButtonDarkNoBorder,
              pressed && { opacity: 0.9 }
            ]}>
              <Text style={[styles.primaryButtonText, { fontSize: 15 * textScale }, theme === 'light' && styles.primaryButtonTextLight]}>Guardar cambios</Text>
            </Pressable>
          </View>
        );

      case 'accessibility':
        return (
          <View style={styles.form}>
            <Text style={[styles.sectionHelp, { color: helpColor, fontSize: 12 * textScale }]}>
              {easyReading ? 'Ajusta estas opciones según tus necesidades.' : 'Estas opciones te ayudan a adaptar la experiencia. El lector de pantalla se configura en tu dispositivo.'}
            </Text>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Tema de la app</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
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
                <Text style={[styles.themeToggleText, theme === 'light' ? { color: '#000000' } : { color: '#FFFFFF' }, { fontSize: 13 * textScale }]}>
                  {theme === 'dark' ? 'Oscuro' : 'Claro'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Modo alto contraste</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
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
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Lectura fácil</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
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

            {/* Control de escala de texto con botones + y - */}
            <View style={styles.textScaleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Tamaño de texto</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
                  {easyReading ? 'Ajusta el tamaño.' : 'Ajusta el tamaño del texto con precisión'}
                </Text>
              </View>
              <View style={styles.textScaleControls}>
                <Pressable
                  style={[styles.scaleButton, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
                  onPress={() => {
                    const newScale = Math.max(0.8, textScale - 0.1);
                    setTextScale(Number(newScale.toFixed(1)));
                  }}
                  accessibilityLabel="Disminuir tamaño de texto"
                  accessibilityRole="button"
                >
                  <Text style={[styles.scaleButtonText, { color: colors.text }]}>-</Text>
                </Pressable>
                <View style={styles.scaleIndicator}>
                  <Text style={[styles.scaleSmallA, { color: colors.text }]}>A</Text>
                  <Text style={[styles.scaleLargeA, { color: colors.text }]}>A</Text>
                </View>
                <Pressable
                  style={[styles.scaleButton, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}
                  onPress={() => {
                    const newScale = Math.min(1.5, textScale + 0.1);
                    setTextScale(Number(newScale.toFixed(1)));
                  }}
                  accessibilityLabel="Aumentar tamaño de texto"
                  accessibilityRole="button"
                >
                  <Text style={[styles.scaleButtonText, { color: colors.text }]}>+</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Feedback háptico</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
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
                <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Sin bordes</Text>
                <Text style={[styles.switchHelp, { color: helpColor, fontSize: 11 * textScale }]}>
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
            <Text style={[styles.sectionHelp, { color: helpColor, fontSize: 12 * textScale }]}>
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
                    <View style={[
                      styles.iconCircle,
                      theme === 'light' && styles.iconCircleLight,
                      earned && theme === 'light' && styles.iconCircleEarnedLight,
                    ]}>
                      <Ionicons name={a.icon as any} size={20} color={earned ? (theme === 'dark' ? '#FFFFFF' : '#000000') : (theme === 'dark' ? '#9CA3AF' : '#666666')} />
                    </View>
                    <Text style={[styles.achievementTitle, { color: colors.text, fontSize: 13 * textScale }]}>{a.title}</Text>
                    <Text style={[styles.achievementDesc, { color: colors.sub, fontSize: 11 * textScale }]}>
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
          </View>
        );

      case 'reports':
        return (
          <View style={styles.form}>
            <View style={[styles.comingSoonBox, theme === 'light' && styles.comingSoonBoxLight, noBorders && styles.comingSoonBoxNoBorder]}>
              <Ionicons name="megaphone-outline" size={48} color={theme === 'dark' ? ACCENT : '#0F172A'} />
              <Text style={[styles.comingSoonTitle, { color: colors.text, fontSize: 18 * textScale }]}>Próximamente</Text>
              <Text style={[styles.comingSoonText, { color: helpColor, fontSize: 13 * textScale }]}>
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
          <Pressable onPress={() => router.back()} hitSlop={8} style={[styles.backButton, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.buttonNoBorder]}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text, fontSize: 22 * textScale }]}>Tu perfil</Text>
          <Pressable onPress={() => setActiveTab('achievements')} hitSlop={8} style={[styles.achievementsBadge, theme === 'light' && { borderColor: '#000000' }, noBorders && styles.buttonNoBorder]}>
            <Ionicons name="trophy" size={16} color={colors.text} />
            <Text style={[styles.achievementsBadgeText, { color: colors.text, fontSize: 12 * textScale }]}>{earnedCount}</Text>
          </Pressable>
        </View>

        <View style={styles.avatarWrapper}>
          <View style={[styles.avatarCircle, theme === 'light' && styles.avatarCircleLight, noBorders && styles.avatarCircleNoBorder]}>
            <Ionicons name="person" size={40} color={theme === 'dark' ? '#9CA3AF' : '#000000'} />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable onPress={() => setActiveTab('settings')} style={[styles.tab, activeTab === 'settings' && styles.tabActive, noBorders && activeTab === 'settings' && styles.tabActiveNoBorder]}>
            <Ionicons name="settings-outline" size={20} color={activeTab === 'settings' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'settings' ? colors.text : helpColor, fontSize: 11 * textScale }]}>Ajustes</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('accessibility')} style={[styles.tab, activeTab === 'accessibility' && styles.tabActive, noBorders && activeTab === 'accessibility' && styles.tabActiveNoBorder]}>
            <Ionicons name="eye-outline" size={20} color={activeTab === 'accessibility' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'accessibility' ? colors.text : helpColor, fontSize: 11 * textScale }]}>Accesibilidad</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('achievements')} style={[styles.tab, activeTab === 'achievements' && styles.tabActive, noBorders && activeTab === 'achievements' && styles.tabActiveNoBorder]}>
            <Ionicons name="trophy-outline" size={20} color={activeTab === 'achievements' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'achievements' ? colors.text : helpColor, fontSize: 11 * textScale }]}>Logros</Text>
          </Pressable>

          <Pressable onPress={() => setActiveTab('reports')} style={[styles.tab, activeTab === 'reports' && styles.tabActive, noBorders && activeTab === 'reports' && styles.tabActiveNoBorder]}>
            <Ionicons name="megaphone-outline" size={20} color={activeTab === 'reports' ? (theme === 'dark' ? '#FFFFFF' : '#0F172A') : helpColor} />
            <Text style={[styles.tabText, { color: activeTab === 'reports' ? colors.text : helpColor, fontSize: 11 * textScale }]}>Denuncias</Text>
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  topBar: { marginBottom: 8 },
  logo: { width: 96, height: 96 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  achievementsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(107, 114, 128, 0.2)' },
  achievementsBadgeText: { fontSize: 12, fontWeight: '700' },
  buttonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700' },
  avatarWrapper: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: ACCENT, backgroundColor: 'rgba(31,41,55,1)', justifyContent: 'center', alignItems: 'center' },
  avatarCircleLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#000000',
  },
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
  primaryButton: { backgroundColor: '#000000', borderRadius: 999, paddingVertical: 10, alignItems: 'center', minHeight: 44, marginTop: 8, borderWidth: 2, borderColor: '#FFFFFF' },
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
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  primaryButtonTextLight: {
    color: '#000000',
  },
  secondaryButton: { borderRadius: 999, borderWidth: 1, borderColor: ACCENT, paddingVertical: 10, alignItems: 'center', minHeight: 44 },
  secondaryButtonNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  secondaryButtonText: { fontWeight: '600', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  sectionHelp: { fontSize: 12, marginBottom: 12 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 },
  switchHelp: { fontSize: 11 },
  textScaleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12 },
  textScaleControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scaleButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  scaleButtonText: { fontSize: 24, fontWeight: '600' },
  scaleIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 50, justifyContent: 'center' },
  scaleSmallA: { fontSize: 14, fontWeight: '600' },
  scaleLargeA: { fontSize: 22, fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(148,163,184,0.4)', marginVertical: 12 },
  themeToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  themeToggleNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  themeToggleText: { fontSize: 13 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  achievementCard: { width: '47%', borderRadius: 16, padding: 12, backgroundColor: 'rgba(15,23,42,0.9)', borderWidth: 1, borderColor: 'rgba(31,41,55,1)' },
  achievementCardLight: { backgroundColor: '#FFFFFF', borderColor: '#000000' },
  achievementCardLocked: { opacity: 0.6 },
  achievementCardNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(107, 114, 128, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
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
  comingSoonBox: { alignItems: 'center', padding: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  comingSoonBoxLight: { backgroundColor: '#FFFFFF', borderColor: '#000000' },
  comingSoonBoxNoBorder: { borderWidth: 0, backgroundColor: 'transparent' },
  comingSoonTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  comingSoonText: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
