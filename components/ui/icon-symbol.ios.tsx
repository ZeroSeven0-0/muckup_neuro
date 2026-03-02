/**
 * ============================================================================
 * ICON SYMBOL COMPONENT (iOS NATIVE)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este archivo es específico para iOS. Cuando la app se ejecuta en iOS,
 * usa SF Symbols (los iconos nativos de Apple) en lugar de Material Icons.
 * 
 * SISTEMA DE ICONOS MULTIPLATAFORMA:
 * - iOS: Usa SF Symbols (este archivo) → icon-symbol.ios.tsx
 * - Android/Web: Usa Material Icons → icon-symbol.tsx
 * 
 * React Native automáticamente elige el archivo correcto según la plataforma:
 * - En iOS: Carga este archivo (icon-symbol.ios.tsx)
 * - En Android/Web: Carga icon-symbol.tsx
 * 
 * SF SYMBOLS:
 * SF Symbols es el sistema de iconos nativo de Apple. Incluye miles de
 * iconos que se integran perfectamente con el diseño de iOS y se adaptan
 * automáticamente a:
 * - Modo claro/oscuro
 * - Tamaños de texto dinámicos (accesibilidad)
 * - Diferentes pesos (ultralight, thin, light, regular, medium, semibold, bold, heavy, black)
 * 
 * PESOS DISPONIBLES (weight):
 * - 'ultralight' - Muy delgado
 * - 'thin' - Delgado
 * - 'light' - Ligero
 * - 'regular' - Normal (default)
 * - 'medium' - Medio
 * - 'semibold' - Semi-negrita
 * - 'bold' - Negrita
 * - 'heavy' - Pesado
 * - 'black' - Muy pesado
 * 
 * CÓMO ENCONTRAR ICONOS:
 * 1. Descarga la app "SF Symbols" de Apple (gratis en Mac App Store)
 * 2. Busca el icono que necesitas
 * 3. Copia el nombre (ej: 'house.fill', 'star.fill', 'heart')
 * 4. Úsalo directamente en el componente
 * 
 * USO:
 * import { IconSymbol } from '@/components/ui/icon-symbol';
 * 
 * <IconSymbol 
 *   name="house.fill" 
 *   size={24} 
 *   color="#000" 
 *   weight="semibold"
 * />
 * 
 * BENEFICIOS:
 * - Iconos nativos de iOS (mejor rendimiento)
 * - Se adaptan automáticamente al tema del sistema
 * - Soportan tamaños dinámicos para accesibilidad
 * - Miles de iconos disponibles sin instalar nada
 */

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * Componente de icono para iOS usando SF Symbols
 * 
 * @param name - Nombre del SF Symbol (ej: 'house.fill', 'star', 'heart.fill')
 * @param size - Tamaño del icono en píxeles (default: 24)
 * @param color - Color del icono (string hex, rgb, etc.)
 * @param style - Estilos adicionales del contenedor
 * @param weight - Peso del símbolo: ultralight, thin, light, regular, medium, semibold, bold, heavy, black (default: 'regular')
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}              // Peso del icono (grosor de las líneas)
      tintColor={color}            // Color del icono
      resizeMode="scaleAspectFit"  // Mantener proporciones al escalar
      name={name}                  // Nombre del SF Symbol
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
