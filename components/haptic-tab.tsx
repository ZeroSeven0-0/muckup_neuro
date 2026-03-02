/**
 * ============================================================================
 * HAPTIC TAB COMPONENT
 * ============================================================================
 * 
 * PROPÓSITO:
 * Componente que envuelve los botones de la barra de navegación inferior (tabs)
 * para agregar retroalimentación háptica (vibración suave) cuando el usuario
 * presiona un tab. Esto mejora la experiencia de usuario al proporcionar
 * confirmación táctil de la interacción.
 * 
 * FUNCIONALIDAD:
 * - Detecta cuando el usuario presiona un tab (onPressIn)
 * - En dispositivos iOS, activa una vibración suave (Light Impact)
 * - En Android/Web, no hace nada (la vibración háptica es específica de iOS)
 * - Mantiene todas las propiedades originales del botón del tab
 * 
 * USO:
 * Este componente se usa automáticamente en la configuración de tabs
 * en `app/(tabs)/_layout.tsx` mediante la prop `tabButton={HapticTab}`
 * 
 * ACCESIBILIDAD:
 * La retroalimentación háptica ayuda a usuarios con discapacidad visual
 * a confirmar que han presionado un botón correctamente.
 * 
 * DEPENDENCIAS:
 * - expo-haptics: Librería de Expo para controlar vibraciones del dispositivo
 * - @react-navigation: Sistema de navegación de React Native
 */

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

/**
 * Componente de tab con retroalimentación háptica
 * @param props - Propiedades del botón de tab de React Navigation
 */
export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Solo activar vibración en iOS (Android no tiene la misma API)
        if (process.env.EXPO_OS === 'ios') {
          // Vibración suave tipo "Light" - la menos intrusiva
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // Llamar al handler original si existe
        props.onPressIn?.(ev);
      }}
    />
  );
}
