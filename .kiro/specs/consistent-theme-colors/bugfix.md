# Bugfix Requirements Document

## Introduction

La aplicación tiene una pantalla de inicio (login) en `app/index.tsx` que implementa correctamente un esquema de colores que cambia dinámicamente entre modo oscuro y modo claro usando el contexto `AppSettingsContext`. Sin embargo, las otras pantallas de la aplicación no están aplicando consistentemente estos mismos colores, lo que resulta en una experiencia visual inconsistente cuando el usuario cambia el tema.

El bug afecta a 6 pantallas principales:
- Dashboard (`app/(tabs)/index.tsx`)
- Mi Ruta (`app/(tabs)/explore.tsx`)
- Sesiones (`app/sessions.tsx`)
- Perfil (`app/profile.tsx`)
- Detalle de curso (`app/course/[id].tsx`)
- Reproductor (`app/player/[lessonId].tsx`)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN el usuario cambia del modo oscuro al modo claro usando el toggle de tema THEN algunas pantallas no actualizan correctamente los colores de fondo, texto y subtexto

1.2 WHEN el usuario navega entre pantallas en modo claro THEN los colores de texto y fondo no coinciden con el esquema definido en la pantalla de inicio (fondo #FFFFFF, texto #000000, subtexto #4B5563)

1.3 WHEN el usuario navega entre pantallas en modo oscuro THEN algunos elementos de texto usan colores incorrectos que no coinciden con el esquema de la pantalla de inicio (fondo #000000, texto #FFFFFF, subtexto #C7C9E8)

1.4 WHEN el usuario está en modo claro THEN las variables de color `sub` en varias pantallas se asignan incorrectamente al mismo valor que `text` en lugar de usar #4B5563

1.5 WHEN el usuario interactúa con tarjetas y elementos de UI en modo claro THEN los bordes y fondos no se adaptan correctamente al tema claro

1.6 WHEN el usuario visualiza iconos y elementos decorativos en modo claro THEN algunos mantienen colores del modo oscuro (como ACCENT en lugar de #0F172A)

### Expected Behavior (Correct)

2.1 WHEN el usuario cambia del modo oscuro al modo claro usando el toggle de tema THEN todas las pantallas SHALL actualizar inmediatamente los colores de fondo, texto y subtexto según el esquema definido

2.2 WHEN el usuario navega entre pantallas en modo claro THEN todas las pantallas SHALL usar consistentemente: fondo #FFFFFF, texto #000000, subtexto #4B5563

2.3 WHEN el usuario navega entre pantallas en modo oscuro THEN todas las pantallas SHALL usar consistentemente: fondo #000000, texto #FFFFFF, subtexto #C7C9E8

2.4 WHEN el usuario está en modo claro THEN la variable `sub` SHALL asignarse a #4B5563 en todas las pantallas

2.5 WHEN el usuario interactúa con tarjetas y elementos de UI en modo claro THEN los bordes y fondos SHALL usar los estilos definidos en `cardLight` con backgroundColor 'rgba(255,255,255,0.75)' y borderColor 'rgba(15,23,42,0.12)'

2.6 WHEN el usuario visualiza iconos y elementos decorativos en modo claro THEN SHALL usar #0F172A en lugar de ACCENT para mantener contraste adecuado

### Unchanged Behavior (Regression Prevention)

3.1 WHEN el usuario está en modo oscuro THEN el sistema SHALL CONTINUE TO usar el esquema de colores actual (fondo #000000, texto #FFFFFF, subtexto #C7C9E8)

3.2 WHEN el usuario interactúa con el color de acento (ACCENT = #8379CD) THEN el sistema SHALL CONTINUE TO usar este color para botones primarios, enlaces y elementos de énfasis en ambos temas

3.3 WHEN el usuario activa el modo alto contraste THEN el sistema SHALL CONTINUE TO aplicar el estilo `cardHC` con borderColor ACCENT

3.4 WHEN el usuario activa texto grande o lectura fácil THEN el sistema SHALL CONTINUE TO aplicar los estilos condicionales correspondientes

3.5 WHEN el usuario navega entre pantallas THEN el sistema SHALL CONTINUE TO mantener el estado del tema seleccionado a través del contexto AppSettingsContext

3.6 WHEN el usuario interactúa con inputs de texto THEN el sistema SHALL CONTINUE TO usar los colores de borde y fondo que cambian según el tema (inputBg e inputBorder)
