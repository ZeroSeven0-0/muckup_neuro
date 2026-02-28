import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppSettingsProvider, useAppSettings } from '@/contexts/AppSettingsContext';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { SessionsProvider } from '@/contexts/SessionsContext';

// Hacemos que la pantalla raíz `index` sea el punto de entrada (login)
export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <CoursesProvider>
        <SessionsProvider>
          <RootNavigator />
        </SessionsProvider>
      </CoursesProvider>
    </AppSettingsProvider>
  );
}

function RootNavigator() {
  const { theme } = useAppSettings();

  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sessions" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="player/[lessonId]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
