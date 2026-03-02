/**
 * ============================================================================
 * LOGIN SCREEN (PANTALLA DE INICIO DE SESIÓN)
 * ============================================================================
 * Ubicación: app/index.tsx
 * Ruta: / (pantalla de entrada de la app)
 * 
 * PROPÓSITO:
 * Esta es la primera pantalla que ve el usuario al abrir la app.
 * Permite iniciar sesión con email y contraseña.
 * 
 * IMPORTANTE: Esta app NO permite registro desde la app móvil.
 * Los usuarios deben registrarse en la página web de la empresa primero.
 * 
 * SECCIONES DE LA PANTALLA:
 * 1. Header con título y subtítulo explicativo
 * 2. Formulario de login:
 *    - Input de email
 *    - Input de contraseña
 *    - Botón "Iniciar sesión"
 *    - Texto de ayuda sobre cómo obtener acceso
 * 3. Preferencias rápidas (configurables antes de entrar):
 *    - Toggle de tema (Oscuro/Claro)
 *    - Switch de alto contraste
 *    - Switch de lectura fácil
 *    - Switch de texto grande
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario ingresa email y contraseña
 * 2. Al presionar "Iniciar sesión", se llama a handleLogin()
 * 3. TODO: handleLogin debe conectarse con FastAPI/Supabase
 * 4. Si las credenciales son correctas, navega a /(tabs) (dashboard)
 * 5. Si son incorrectas, muestra error (por implementar)
 * 
 * NAVEGACIÓN:
 * - Éxito → /(tabs) (dashboard)
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta theme dark/light
 * - Inputs con minHeight de 44px
 * - KeyboardAvoidingView para iOS
 * 
 * INTEGRACIÓN CON BACKEND (FUTURO):
 * - handleLogin debe hacer POST a /api/auth/login
 * - Guardar token JWT en AsyncStorage
 * - Validar credenciales antes de navegar
 * - Mostrar errores de autenticación
 * - Implementar "Olvidé mi contraseña"
 * ============================================================================
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from 'react-native';

import { getCommonStyles, getTextStyles, getThemeColors } from '@/constants/globalStyles';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const ACCENT = '#6B7280'; // Color de acento: gris medio

export default function LoginScreen() {
  const router = useRouter();
  // Obtener configuraciones de accesibilidad y sus setters
  const { theme, setTheme, highContrast, setHighContrast, easyReading, setEasyReading, textScale, setTextScale, noBorders, setNoBorders, haptics, setHaptics } =
    useAppSettings();
  
  // Estilos globales
  const commonStyles = getCommonStyles(theme, false, highContrast);
  const textStyles = getTextStyles(textScale);
  const colors = getThemeColors(theme);
  
  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Maneja el inicio de sesión
   * TODO: Conectar con FastAPI/Supabase para autenticación real
   * 
   * FLUJO FUTURO:
   * 1. Validar que email y password no estén vacíos
   * 2. Hacer POST a /api/auth/login con { email, password }
   * 3. Si respuesta es exitosa:
   *    - Guardar token JWT en AsyncStorage
   *    - Navegar a /(tabs)
   * 4. Si respuesta es error:
   *    - Mostrar mensaje de error
   *    - Mantener al usuario en login
   */
  const handleLogin = () => {
    // TODO: Aquí en el futuro: llamada a FastAPI/Supabase
    // Por ahora, simplemente navegamos a las tabs principales
    router.replace('/(tabs)');
  };

  const inputBg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const inputBorder = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.root}>
      <View style={[styles.gradient, { backgroundColor: colors.bg }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo centrado arriba */}
          <View style={styles.logoContainer}>
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
        
        <View accessibilityLabel="Pantalla de inicio de sesión para estudiantes activos">
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text, fontSize: 24 * textScale }]}>Acceso a tu programa</Text>
          <Text style={[styles.subtitle, { color: colors.sub, fontSize: 14 * textScale }]}>
            {easyReading
              ? 'Inicia sesión con tu usuario y contraseña.'
              : 'Inicia sesión con las credenciales que recibiste. No es posible registrarse desde esta app.'}
          </Text>
        </View>

        <View accessible style={styles.form}>
          <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Correo electrónico</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: colors.text,
                fontSize: 16 * textScale,
              },
            ]}
            placeholder="tu@correo.com"
            placeholderTextColor="#7C7FA5"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Campo de correo electrónico"
          />

          <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Contraseña</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: colors.text,
                fontSize: 16 * textScale,
              },
            ]}
            placeholder="••••••••"
            placeholderTextColor="#7C7FA5"
            secureTextEntry
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Campo de contraseña"
          />

          <Pressable
            onPress={handleLogin}
            style={({ pressed }) => [
              styles.primaryButton,
              theme === 'light' && styles.primaryButtonLight,
              theme === 'light' && noBorders && styles.primaryButtonLightNoBorder,
              theme === 'dark' && noBorders && styles.primaryButtonDarkNoBorder,
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Iniciar sesión en el programa"
          >
            <Text style={[styles.primaryButtonText, { fontSize: 15 * textScale }, theme === 'light' && styles.primaryButtonTextLight]}>Iniciar sesión</Text>
          </Pressable>

          <Text style={[styles.helperText, { color: colors.sub, fontSize: 12 * textScale }]}>
            Si aún no tienes usuario, solicita acceso a tu equipo de programas. Esta app está
            diseñada solo para estudiantes activos.
          </Text>

          <View style={styles.divider} />

          <Text style={[styles.accessTitle, { color: colors.text, fontSize: 16 * textScale }]}>Preferencias rápidas</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Tema</Text>
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Cambia entre modo claro y oscuro para toda la app.
              </Text>
            </View>
            <Pressable
              onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              accessibilityRole="button"
              accessibilityLabel="Cambiar entre modo claro y oscuro"
              hitSlop={8}
              style={[
                styles.themeToggle,
                {
                  borderColor: theme === 'dark' ? '#FFFFFF' : '#000000',
                  backgroundColor: theme === 'dark' ? '#000000' : '#FFFFFF',
                },
              ]}
            >
              <Text
                style={[
                  styles.themeToggleText,
                  { color: theme === 'dark' ? '#FFFFFF' : '#000000', fontSize: 13 * textScale },
                ]}
              >
                {theme === 'dark' ? 'Oscuro' : 'Claro'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Modo alto contraste</Text>
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Mejora la separación entre fondo, texto y botones.
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
              <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Lectura fácil</Text>
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Simplifica textos largos en el contenido de la ruta.
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

          {/* Control de escala de texto con botones + y - */}
          <View style={styles.textScaleContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Tamaño de texto</Text>
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Ajusta el tamaño del texto con precisión
              </Text>
            </View>
            <View style={styles.textScaleControls}>
              <Pressable
                style={[styles.scaleButton, { backgroundColor: inputBg, borderColor: inputBorder }]}
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
                style={[styles.scaleButton, { backgroundColor: inputBg, borderColor: inputBorder }]}
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
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Activa pequeñas vibraciones al completar acciones clave.
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

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.sub, fontSize: 13 * textScale }]}>Sin bordes</Text>
              <Text style={[styles.switchHelp, { color: colors.sub, fontSize: 11 * textScale }]}>
                Elimina los bordes de todas las tarjetas y contenedores.
              </Text>
            </View>
            <Switch
              value={noBorders}
              onValueChange={setNoBorders}
              thumbColor={noBorders ? '#FFFFFF' : '#6B7280'}
              trackColor={{ false: '#4B5563', true: ACCENT }}
              accessibilityLabel="Activar o desactivar sin bordes"
            />
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#C7C9E8',
    fontSize: 14,
    marginBottom: 32,
  },
  form: {
    gap: 8,
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
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 44,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
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
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  primaryButtonTextLight: {
    color: '#000000',
  },
  helperText: {
    color: '#C7C9E8',
    fontSize: 12,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 16,
  },
  accessTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  switchHelp: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  themeToggleText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  textScaleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, gap: 12 },
  textScaleControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scaleButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  scaleButtonText: { fontSize: 24, fontWeight: '600' },
  scaleIndicator: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 50, justifyContent: 'center' },
  scaleSmallA: { fontSize: 14, fontWeight: '600' },
  scaleLargeA: { fontSize: 22, fontWeight: '600' },
});
