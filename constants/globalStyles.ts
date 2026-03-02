/**
 * ============================================================================
 * GLOBAL STYLES - ESTILOS COMPARTIDOS
 * ============================================================================
 * 
 * Este archivo contiene funciones generadoras de estilos que se reutilizan
 * en múltiples pantallas de la aplicación. Los estilos son dinámicos y se
 * adaptan según el tema, configuración de accesibilidad y otras preferencias.
 * 
 * FUNCIONES PRINCIPALES:
 * - getCommonStyles: Estilos base que dependen del tema y configuración
 * - getTextStyles: Estilos de texto con soporte para textScale
 * - getButtonStyles: Estilos de botones y elementos interactivos
 * 
 * USO:
 * import { getCommonStyles, getTextStyles } from '@/constants/globalStyles';
 * 
 * const commonStyles = getCommonStyles(theme, noBorders, highContrast);
 * const textStyles = getTextStyles(textScale);
 * 
 * <View style={[commonStyles.card, styles.localCard]} />
 * <Text style={[textStyles.title, { color: text }]}>Título</Text>
 * ============================================================================
 */

const ACCENT = '#6B7280'; // Color de acento: gris medio

/**
 * Estilos comunes que dependen del tema y configuración de accesibilidad
 */
export const getCommonStyles = (
  theme: 'dark' | 'light',
  noBorders: boolean = false,
  highContrast: boolean = false
) => {
  const isDark = theme === 'dark';

  return {
    // ========== CONTENEDORES ==========
    root: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    
    gradient: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },

    scrollContainer: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },

    // ========== HEADER Y LOGO ==========
    topBar: {
      marginBottom: 20,
    },

    logo: {
      width: 96,
      height: 96,
    },

    // ========== TARJETAS (CARDS) ==========
    card: {
      backgroundColor: isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      borderWidth: noBorders ? 0 : 1,
      borderColor: isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : '#000000',
      marginBottom: 12,
    },

    cardLight: {
      backgroundColor: '#FFFFFF',
      borderColor: '#000000',
    },

    cardNoBorder: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },

    cardHC: {
      borderColor: ACCENT,
      borderWidth: 2,
    },

    // ========== TARJETAS DE LOGROS ==========
    achievementCard: {
      width: '48%',
      borderRadius: 16,
      padding: 12,
      backgroundColor: isDark 
        ? 'rgba(15, 23, 42, 0.9)' 
        : '#FFFFFF',
      borderWidth: noBorders ? 0 : 1,
      borderColor: isDark 
        ? 'rgba(31, 41, 55, 1)' 
        : '#000000',
    },

    achievementCardLocked: {
      opacity: 0.6,
    },

    achievementCardNoBorder: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },

    // ========== INPUTS ==========
    input: {
      borderWidth: noBorders ? 0 : 1,
      borderColor: isDark ? '#FFFFFF' : '#000000',
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
    },

    inputNoBorder: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },

    // ========== BOTONES ==========
    primaryButton: {
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
      borderColor: isDark ? '#FFFFFF' : '#000000',
    },

    primaryButtonNoBorder: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      borderWidth: 0,
    },

    secondaryButton: {
      borderRadius: 999,
      borderWidth: 2,
      borderColor: isDark ? '#FFFFFF' : '#000000',
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },

    secondaryButtonNoBorder: {
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      borderWidth: 0,
    },

    // ========== BARRA DE PROGRESO ==========
    progressBarBackground: {
      flex: 1,
      height: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(107, 114, 128, 0.25)',
    },

    progressBarFill: {
      height: 6,
      borderRadius: 999,
      backgroundColor: ACCENT,
    },

    // ========== PILLS/BADGES ==========
    mediaPill: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(107, 114, 128, 0.3)',
    },
  };
};

/**
 * Estilos de texto que dependen de textScale
 */
export const getTextStyles = (textScale: number = 1.0) => ({
  // Títulos principales
  title: {
    fontSize: 22 * textScale,
    fontWeight: '700' as const,
    marginBottom: 8,
  },

  // Subtítulos
  subtitle: {
    fontSize: 14 * textScale,
    marginBottom: 16,
  },

  // Títulos de sección
  sectionTitle: {
    fontSize: 16 * textScale,
    fontWeight: '600' as const,
    marginBottom: 8,
  },

  // Texto de cuerpo
  bodyText: {
    fontSize: 14 * textScale,
  },

  // Texto secundario/meta
  secondaryText: {
    fontSize: 12 * textScale,
  },

  // Texto pequeño
  smallText: {
    fontSize: 11 * textScale,
  },

  // Texto de botones
  buttonText: {
    fontSize: 13 * textScale,
    fontWeight: '600' as const,
  },

  // Texto de pills/badges
  pillText: {
    fontSize: 11 * textScale,
  },
});

/**
 * Obtener colores según el tema
 */
export const getThemeColors = (theme: 'dark' | 'light') => {
  const isDark = theme === 'dark';
  
  return {
    bg: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    sub: isDark ? '#C7C9E8' : '#000000',
    accent: ACCENT,
    inputBg: isDark ? '#000000' : '#FFFFFF',
    inputBorder: isDark ? '#FFFFFF' : '#000000',
  };
};

/**
 * Constantes de color
 */
export const COLORS = {
  ACCENT,
  DARK_BG: '#000000',
  DARK_TEXT: '#FFFFFF',
  DARK_SUB: '#C7C9E8',
  LIGHT_BG: '#FFFFFF',
  LIGHT_TEXT: '#000000',
  LIGHT_SUB: '#000000',
};
