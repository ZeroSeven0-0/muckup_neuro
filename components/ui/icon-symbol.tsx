/**
 * ============================================================================
 * ICON SYMBOL COMPONENT (ANDROID/WEB FALLBACK)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este archivo es el fallback (respaldo) para Android y Web. Cuando la app
 * se ejecuta en estas plataformas, usa Material Icons en lugar de SF Symbols.
 * 
 * SISTEMA DE ICONOS MULTIPLATAFORMA:
 * - iOS: Usa SF Symbols (iconos nativos de Apple) → icon-symbol.ios.tsx
 * - Android/Web: Usa Material Icons (este archivo) → icon-symbol.tsx
 * 
 * React Native automáticamente elige el archivo correcto según la plataforma:
 * - En iOS: Carga icon-symbol.ios.tsx
 * - En Android/Web: Carga icon-symbol.tsx (este archivo)
 * 
 * MAPEO DE ICONOS:
 * Como SF Symbols y Material Icons tienen nombres diferentes, este componente
 * mantiene un mapeo (MAPPING) que traduce nombres de SF Symbols a Material Icons.
 * 
 * Ejemplo:
 * - SF Symbol: 'house.fill' → Material Icon: 'home'
 * - SF Symbol: 'paperplane.fill' → Material Icon: 'send'
 * 
 * CÓMO AGREGAR NUEVOS ICONOS:
 * 1. Busca el SF Symbol en: https://developer.apple.com/sf-symbols/
 * 2. Busca el Material Icon equivalente en: https://icons.expo.fyi
 * 3. Agrega el mapeo al objeto MAPPING
 * 
 * Ejemplo:
 * const MAPPING = {
 *   'star.fill': 'star',           // SF Symbol → Material Icon
 *   'heart.fill': 'favorite',      // SF Symbol → Material Icon
 * }
 * 
 * USO:
 * import { IconSymbol } from '@/components/ui/icon-symbol';
 * 
 * <IconSymbol name="house.fill" size={24} color="#000" />
 * 
 * BENEFICIOS:
 * - Iconos nativos en cada plataforma (mejor rendimiento)
 * - Interfaz unificada (mismo código para todas las plataformas)
 * - Apariencia consistente con el sistema operativo
 */

// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Tipo para el mapeo de SF Symbols a Material Icons
type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;

// Tipo para los nombres de iconos válidos (solo los que están en MAPPING)
type IconSymbolName = keyof typeof MAPPING;

/**
 * MAPEO DE ICONOS: SF Symbols → Material Icons
 * 
 * Agrega aquí los iconos que uses en tu app:
 * - Busca SF Symbols en: https://developer.apple.com/sf-symbols/
 * - Busca Material Icons en: https://icons.expo.fyi
 */
const MAPPING = {
  'house.fill': 'home',                                    // Icono de casa/inicio
  'paperplane.fill': 'send',                               // Icono de enviar
  'chevron.left.forwardslash.chevron.right': 'code',      // Icono de código
  'chevron.right': 'chevron-right',                        // Flecha derecha
} as IconMapping;

/**
 * Componente de icono multiplataforma
 * 
 * En Android/Web usa Material Icons
 * En iOS usa SF Symbols (ver icon-symbol.ios.tsx)
 * 
 * @param name - Nombre del SF Symbol (debe estar en MAPPING)
 * @param size - Tamaño del icono en píxeles (default: 24)
 * @param color - Color del icono (string o valor opaco)
 * @param style - Estilos adicionales de texto
 * @param weight - Peso del símbolo (ignorado en Android/Web, solo para iOS)
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  // Renderizar Material Icon usando el nombre mapeado
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
