#!/usr/bin/env node

/**
 * ============================================================================
 * SCRIPT DE RESET DE PROYECTO EXPO
 * ============================================================================
 * 
 * PROPÓSITO:
 * Este script es parte de la plantilla inicial de Expo. Permite resetear
 * el proyecto a un estado "en blanco" eliminando o moviendo los archivos
 * de ejemplo que vienen con la plantilla.
 * 
 * ⚠️ IMPORTANTE PARA ESTE PROYECTO:
 * Este script NO debe ejecutarse en este proyecto porque ya tiene código
 * funcional implementado. Está aquí solo como parte de la plantilla de Expo.
 * 
 * QUÉ HACE EL SCRIPT:
 * 1. Pregunta al usuario si quiere mover o eliminar los archivos de ejemplo
 * 2. Si elige "mover": Crea carpeta /app-example y mueve todo ahí
 * 3. Si elige "eliminar": Borra las carpetas /app, /components, /hooks, etc.
 * 4. Crea una nueva carpeta /app con archivos mínimos (index.tsx y _layout.tsx)
 * 
 * CUÁNDO USAR:
 * - Solo al iniciar un proyecto NUEVO desde la plantilla de Expo
 * - Cuando quieres empezar desde cero sin los ejemplos de Expo
 * 
 * CUÁNDO NO USAR:
 * - En proyectos que ya tienen código funcional (como este)
 * - Si ya has modificado los archivos de /app, /components, etc.
 * 
 * CÓMO EJECUTAR (si fuera necesario):
 * npm run reset-project
 * 
 * CÓMO ELIMINAR:
 * Puedes borrar este archivo de forma segura si ya no lo necesitas.
 * También elimina el script "reset-project" de package.json
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Directorio raíz del proyecto
const root = process.cwd();

// Carpetas que se moverán o eliminarán
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];

// Nombre de la carpeta donde se moverán los ejemplos (si el usuario elige mover)
const exampleDir = "app-example";

// Nombre de la nueva carpeta /app que se creará
const newAppDir = "app";

// Ruta completa a la carpeta de ejemplos
const exampleDirPath = path.join(root, exampleDir);

// Contenido del archivo index.tsx mínimo que se creará
const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

// Contenido del archivo _layout.tsx mínimo que se creará
const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

// Interfaz de línea de comandos para preguntar al usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Función principal que mueve o elimina directorios según la elección del usuario
 * @param userInput - 'y' para mover, 'n' para eliminar
 */
const moveDirectories = async (userInput) => {
  try {
    // Si el usuario eligió mover (y), crear carpeta app-example
    if (userInput === "y") {
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Procesar cada carpeta de la lista
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      
      // Verificar si la carpeta existe
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          // MOVER: Mover carpeta a /app-example
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          // ELIMINAR: Borrar carpeta completamente
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Crear nueva carpeta /app vacía
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Crear archivo index.tsx mínimo
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Crear archivo _layout.tsx mínimo
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    // Mostrar mensaje de éxito con próximos pasos
    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

// Preguntar al usuario qué quiere hacer
rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    
    // Validar respuesta
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
