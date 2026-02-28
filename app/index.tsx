import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';

import { useAppSettings } from '@/contexts/AppSettingsContext';

// Pantalla de inicio de sesión (solo login, sin registro).
// Más adelante podrás conectar esto con FastAPI/Supabase.

const ACCENT = '#6B7280'; // Gris medio

export default function LoginScreen() {
  const router = useRouter();
  const { theme, setTheme, highContrast, setHighContrast, easyReading, setEasyReading, largeText, setLargeText } =
    useAppSettings();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí en el futuro: llamada a FastAPI/Supabase.
    // Por ahora, simplemente navegamos a las tabs principales.
    router.replace('/(tabs)');
  };

  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const text = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const sub = theme === 'dark' ? '#C7C9E8' : '#4B5563';
  const inputBg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const inputBorder = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <View style={styles.root}>
      <View style={[styles.gradient, { backgroundColor: bg }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View accessibilityLabel="Pantalla de inicio de sesión para estudiantes activos">
          <Text accessibilityRole="header" style={[styles.title, { color: text }, largeText && { fontSize: 28 }]}>Acceso a tu programa</Text>
          <Text style={[styles.subtitle, { color: sub }, largeText && { fontSize: 16 }]}>
            {easyReading
              ? 'Inicia sesión con tu usuario y contraseña.'
              : 'Inicia sesión con las credenciales que recibiste. No es posible registrarse desde esta app.'}
          </Text>
        </View>

        <View accessible style={styles.form}>
          <Text style={[styles.label, { color: sub }]}>Correo electrónico</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: text,
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

          <Text style={[styles.label, { color: sub }]}>Contraseña</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                borderColor: inputBorder,
                color: text,
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
              pressed && { opacity: 0.9 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Iniciar sesión en el programa"
          >
            <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
          </Pressable>

          <Text style={[styles.helperText, { color: sub }]}>
            Si aún no tienes usuario, solicita acceso a tu equipo de programas. Esta app está
            diseñada solo para estudiantes activos.
          </Text>

          <View style={styles.divider} />

          <Text style={[styles.accessTitle, { color: text }]}>Preferencias rápidas</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: sub }]}>Tema</Text>
              <Text style={[styles.switchHelp, { color: sub }]}>
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
                  { color: theme === 'dark' ? '#FFFFFF' : '#000000' },
                ]}
              >
                {theme === 'dark' ? 'Oscuro' : 'Claro'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: sub }]}>Modo alto contraste</Text>
              <Text style={[styles.switchHelp, { color: sub }]}>
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
              <Text style={[styles.label, { color: sub }]}>Lectura fácil</Text>
              <Text style={[styles.switchHelp, { color: sub }]}>
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

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: sub }]}>Texto grande</Text>
              <Text style={[styles.switchHelp, { color: sub }]}>
                Aumenta el tamaño de textos en toda la app.
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
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    justifyContent: 'center',
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
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 44,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 15,
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
});
