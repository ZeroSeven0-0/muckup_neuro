/**
 * ============================================================================
 * PLAYER SCREEN (REPRODUCTOR DE MEDIOS)
 * ============================================================================
 * Ubicación: app/player/[lessonId].tsx
 * Ruta: /player/[lessonId] (pantalla dinámica según ID de lección)
 * 
 * PROPÓSITO:
 * Esta pantalla reproduce el contenido multimedia de una lección (video o podcast).
 * Soporta múltiples fuentes: YouTube, Spotify, archivos MP4/MP3 directos.
 * 
 * PARÁMETROS DE URL:
 * - lessonId: ID de la lección a reproducir (ej: 'm1v1', 'm2p1')
 * 
 * FUNCIONALIDADES:
 * 1. Detección automática del tipo de medio según la URL
 * 2. Reproductor integrado con WebView (YouTube, Spotify)
 * 3. Reproductor nativo para archivos directos (MP4, MP3)
 * 4. Botón para ampliar/reducir el reproductor
 * 5. Transcripción expandible/colapsable
 * 6. Fallback para abrir en app externa si falla el embed
 * 7. Aviso especial para contenido de Spotify
 * 
 * TIPOS DE EMBED SOPORTADOS:
 * - 'web': YouTube, Spotify (usa WebView)
 * - 'video': Archivos MP4, M3U8, MOV (usa expo-av Video)
 * - 'audio': Archivos MP3, M4A, AAC (usa HTML5 audio en WebView)
 * 
 * FUNCIONES AUXILIARES:
 * - parseYouTubeId(): Extrae el ID de video de URLs de YouTube
 * - getEmbedFor(): Determina el tipo de embed según la URL
 * 
 * ESTADOS:
 * - failed: Si el reproductor no pudo cargar el contenido
 * - expanded: Si el reproductor está en modo ampliado o compacto
 * 
 * NAVEGACIÓN:
 * - Botón volver → Regresa al detalle del curso
 * - Botón "Abrir en Spotify" → Abre la app de Spotify
 * - Botón "Abrir en app externa" → Abre el contenido fuera de la app
 * 
 * ACCESIBILIDAD:
 * - Soporta largeText (texto grande)
 * - Soporta easyReading (textos simplificados)
 * - Soporta noBorders (sin bordes)
 * - Soporta theme dark/light
 * - Botón ampliar/reducir con accessibilityRole="switch"
 * 
 * NOTAS TÉCNICAS:
 * - YouTube usa youtube-nocookie.com para mejor privacidad
 * - Spotify puede fallar ocasionalmente por restricciones de embed
 * - Los archivos directos se reproducen con controles nativos
 * ============================================================================
 */

import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useCourses } from '@/contexts/CoursesContext';
import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import WebView from 'react-native-webview';

/**
 * Extrae el ID de video de una URL de YouTube
 * Soporta formatos: youtu.be, youtube.com/watch, youtube.com/embed, youtube.com/shorts
 */
function parseYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace('/', '');
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v') ?? undefined;
      const parts = u.pathname.split('/');
      const idx = parts.findIndex(p => p === 'embed' || p === 'shorts');
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {}
  return undefined;
}

/**
 * Determina el tipo de embed según la URL del medio
 * @param url - URL del contenido multimedia
 * @param mediaType - Tipo de medio ('video' o 'podcast')
 * @returns Objeto con 'kind' (tipo de embed) y 'src' (URL procesada)
 */
function getEmbedFor(url: string, mediaType: 'video' | 'podcast') {
  // YouTube: convertir a embed de youtube-nocookie
  const ytId = parseYouTubeId(url);
  if (ytId) {
    return {
      kind: 'web' as const,
      src: `https://www.youtube-nocookie.com/embed/${ytId}?playsinline=1&modestbranding=1&rel=0&autoplay=1`,
    };
  }
  
  // Spotify: convertir a embed de Spotify
  try {
    const u = new URL(url);
    if (u.hostname.includes('open.spotify.com')) {
      const path = u.pathname.split('/').filter(Boolean);
      // Ignora prefijo de localización ej. "intl-es"
      const first = path[0];
      const hasLocalePrefix = first?.startsWith('intl-');
      const type = hasLocalePrefix ? path[1] : path[0];
      const id = hasLocalePrefix ? path[2] : path[1];
      if (type && id) {
        return {
          kind: 'web' as const,
          src: `https://open.spotify.com/embed/${type}/${id}`,
        };
      }
    }
  } catch {}
  
  // Archivos de audio directos (heurística simple)
  if (/\.(mp3|m4a|aac)($|\?)/i.test(url)) {
    return { kind: 'audio' as const, src: url };
  }
  
  // Archivos de video directos (heurística simple)
  if (/\.(mp4|m3u8|mov)($|\?)/i.test(url)) {
    return { kind: 'video' as const, src: url };
  }
  
  // Fallback: abrir en webview
  return { kind: 'web' as const, src: url };
}

export default function PlayerScreen() {
  const router = useRouter();
  // Obtener el ID de la lección desde la URL
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const { modules } = useCourses();
  
  // Estados del reproductor
  const [failed, setFailed] = useState(false);      // Si falló la carga del embed
  const [expanded, setExpanded] = useState(true);   // Si está en modo ampliado
  
  // Configuraciones de accesibilidad
  const { theme, largeText, noBorders, easyReading } = useAppSettings();
  
  // Colores según el tema
  const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const panelBg = theme === 'dark' ? '#111' : '#E5E7EB';
  const mutedBorder = theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
  const transcriptBorder = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const transcriptHeaderBg = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const transcriptScrollBg = theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
  const fallbackBtnBg = theme === 'dark' ? '#FFFFFF' : '#000000';
  const fallbackBtnText = theme === 'dark' ? '#000000' : '#FFFFFF';

  // Buscar la lección en todos los módulos (useMemo para optimizar)
  const lesson = useMemo(() => {
    const id = Array.isArray(lessonId) ? lessonId[0] : lessonId;
    for (const m of modules) {
      const l = m.lessons.find(ls => ls.id === id);
      if (l) return l;
    }
    return undefined;
  }, [lessonId, modules]);

  // Si no se encuentra la lección, mostrar error
  if (!lesson) {
    return (
      <View style={[styles.root]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Volver">
            <Ionicons name="chevron-back" size={20} />
          </Pressable>
          <Text style={styles.title}>Contenido no encontrado</Text>
        </View>
        <Text>Revisa el enlace desde el curso.</Text>
      </View>
    );
  }

  // Determinar el tipo de embed según la URL
  const embed = getEmbedFor(lesson.mediaUrl, lesson.mediaType);
  // Detectar si es contenido de Spotify (para mostrar aviso)
  const isSpotify = lesson.mediaUrl.includes('open.spotify.com');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, noBorders && styles.backBtnNoBorder]}
          accessibilityRole="button"
          accessibilityLabel="Volver"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={textColor} />
        </Pressable>
        <Text
          style={[styles.title, { color: textColor }, largeText && { fontSize: 18 }]}
          accessibilityRole="header"
          accessibilityLabel={`Reproductor. ${lesson.title}`}
        >
          {lesson.title}
        </Text>
        <Pressable
          onPress={() => setExpanded((e) => !e)}
          style={[styles.expandBtn, { borderColor: mutedBorder }, noBorders && styles.expandBtnNoBorder]}
          accessibilityRole="switch"
          accessibilityState={{ checked: expanded }}
          accessibilityLabel={expanded ? 'Reducir reproductor' : 'Ampliar reproductor'}
          hitSlop={8}
        >
          <Text style={[styles.expandText, { color: textColor }]}>
            {easyReading ? (expanded ? '-' : '+') : (expanded ? 'Reducir' : 'Ampliar')}
          </Text>
        </Pressable>
      </View>

      {/* Aviso especial para contenido de Spotify */}
      {isSpotify && (
        <View style={[styles.noticeBox, { borderColor: transcriptBorder, backgroundColor: transcriptHeaderBg }, noBorders && styles.noticeBoxNoBorder]}>
          <Text style={[styles.noticeText, { color: textColor }]}>
            {easyReading 
              ? 'Puedes abrir en Spotify si no carga.' 
              : 'También puedes abrir directamente en Spotify si prefieres usar su reproductor nativo o si el reproductor integrado no carga correctamente (esto puede ocurrir ocasionalmente por restricciones de Spotify).'}
          </Text>
          <Pressable
            style={[styles.noticeBtn, { borderColor: mutedBorder }, noBorders && styles.noticeBtnNoBorder]}
            onPress={() => Linking.openURL(lesson.mediaUrl)}
            accessibilityRole="button"
            accessibilityLabel="Abrir audio en Spotify"
          >
            <Text style={[styles.noticeBtnText, { color: textColor }]}>Abrir en Spotify</Text>
          </Pressable>
        </View>
      )}

      {/* Contenedor del reproductor */}
      <View
        style={[
          styles.playerBox,
          expanded ? styles.playerBoxExpanded : styles.playerBoxCompact,
          { backgroundColor: panelBg },
        ]}
        accessibilityLabel="Reproductor de medios"
        accessibilityHint="Toca dos veces para interactuar; use el botón Ampliar para aumentar el área"
        accessible
      >
        {/* Reproductor WebView para YouTube y Spotify */}
        {embed.kind === 'web' && !failed && (
          <WebView
            source={{ uri: embed.src }}
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState
            onError={() => setFailed(true)}
            onHttpError={() => setFailed(true)}
            renderLoading={() => (
              <View style={styles.loader}>
                <ActivityIndicator />
              </View>
            )}
          />
        )}
        {/* Reproductor nativo para archivos de video directos */}
        {embed.kind === 'video' && (
          <Video
            style={{ flex: 1 }}
            source={{ uri: embed.src }}
            useNativeControls
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
          />
        )}
        
        {/* Reproductor HTML5 audio para archivos de audio directos */}
        {embed.kind === 'audio' && (
          <WebView
            startInLoadingState
            originWhitelist={['*']}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            source={{
              html: `<!doctype html>
              <html><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
              <body style="background:${panelBg};display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
                <audio controls autoplay style="width:90%">
                  <source src="${embed.src}">
                </audio>
              </body></html>`,
            }}
          />
        )}
        
        {/* Fallback cuando el reproductor falla (ej: YouTube bloqueó el embed) */}
        {failed && (
          <View style={styles.fallback}>
            <Text style={[styles.fallbackText, { color: textColor }]}>
              {easyReading 
                ? 'No se pudo cargar el video.' 
                : 'No se pudo cargar el reproductor integrado. Esto puede ocurrir porque YouTube bloquea la inserción de algunos videos por políticas de privacidad.'}
            </Text>
            <Pressable
              style={[styles.fallbackBtn, { backgroundColor: fallbackBtnBg }]}
              onPress={() => Linking.openURL(lesson.mediaUrl)}
              accessibilityRole="button"
              accessibilityLabel="Abrir contenido en su aplicación"
            >
              <Text style={[styles.fallbackBtnText, { color: fallbackBtnText }]}>
                {easyReading ? 'Abrir en app externa' : 'Abrir contenido en aplicación externa'}
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.controlsRow}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {easyReading ? 'Texto' : 'Transcripción'}
        </Text>
        <TranscriptToggle
          transcript={lesson.transcript}
          textColor={textColor}
          borderColor={transcriptBorder}
          headerBg={transcriptHeaderBg}
          scrollBg={transcriptScrollBg}
          theme={theme}
          noBorders={noBorders}
          easyReading={easyReading}
        />
      </View>
    </View>
    </>
  );
}

/**
 * Componente para mostrar/ocultar la transcripción
 * Permite expandir y colapsar el texto completo de la transcripción
 */
function TranscriptToggle({
  transcript,
  textColor,
  borderColor,
  headerBg,
  scrollBg,
  theme,
  noBorders,
  easyReading,
}: {
  transcript: string;
  textColor: string;
  borderColor: string;
  headerBg: string;
  scrollBg: string;
  theme: 'dark' | 'light';
  noBorders: boolean;
  easyReading: boolean;
}) {
  // Estado para controlar si está abierto o cerrado
  const [open, setOpen] = useState(false);
  
  return (
    <View style={[styles.transcriptBox, { borderColor }, noBorders && styles.transcriptBoxNoBorder]}>
      <Pressable
        style={[styles.transcriptHeader, { backgroundColor: headerBg }]}
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityLabel="Mostrar u ocultar transcripción"
      >
        <Text style={[styles.transcriptHeaderText, { color: textColor }]}>
          {easyReading 
            ? (open ? 'Ocultar texto' : 'Ver texto') 
            : (open ? 'Ocultar transcripción completa' : 'Mostrar transcripción completa')}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={textColor} />
      </Pressable>
      {open && (
        <ScrollView style={[styles.transcriptScroll, { backgroundColor: scrollBg }]} contentContainerStyle={{ padding: 12 }}>
          <Text style={[styles.transcriptText, { color: textColor }]}>
            {transcript || (easyReading ? 'No hay texto disponible.' : 'No hay transcripción disponible para este contenido en este momento.')}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: 'transparent',
  },
  backBtnNoBorder: {
    borderWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    flexShrink: 1,
  },
  expandBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  expandBtnNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  expandText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playerBox: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  playerBoxExpanded: {
    height: 420,
  },
  playerBoxCompact: {
    height: 300,
  },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  fallbackText: { fontSize: 13, textAlign: 'center' },
  fallbackBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 8 },
  fallbackBtnText: { fontWeight: '700' },
  controlsRow: {
    marginTop: 4,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  transcriptBox: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  transcriptBoxNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  transcriptHeader: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  transcriptHeaderText: { fontWeight: '600' },
  transcriptScroll: { maxHeight: 260 },
  transcriptText: { lineHeight: 20 },
  noticeBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  noticeBoxNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  noticeText: { fontSize: 12, lineHeight: 18 },
  noticeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  noticeBtnNoBorder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  noticeBtnText: { fontSize: 12, fontWeight: '600' },
});
