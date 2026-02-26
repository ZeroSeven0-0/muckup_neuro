import React, { createContext, useContext, useState, type ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

type AppSettings = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  easyReading: boolean;
  setEasyReading: (value: boolean) => void;
  largeText: boolean;
  setLargeText: (value: boolean) => void;
  haptics: boolean;
  setHaptics: (value: boolean) => void;
};

const AppSettingsContext = createContext<AppSettings | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [highContrast, setHighContrast] = useState(true);
  // Por defecto mostramos contenido completo (no "lectura fácil") para evitar textos demasiado cortos.
  const [easyReading, setEasyReading] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [haptics, setHaptics] = useState(true);

  return (
    <AppSettingsContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error('useAppSettings must be used within AppSettingsProvider');
  }
  return ctx;
}

