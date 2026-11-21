# Control de Caja

Aplicación móvil offline-first para el control operativo de efectivo. El cliente está construido con React y Capacitor; Astro genera la capa web estática que carga la experiencia React como una isla de cliente. El servidor del repositorio es una **simulación del ERP**, no un sistema bancario ni un ERP real.

## Estructura

- `packages/domain`: reglas, tipos, permisos y contratos compartidos.
- `apps/mobile`: aplicación React + Astro + Capacitor, con almacenamiento local Dexie.
- `apps/server`: servidor ERP simulado con Fastify y SQLite.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Android Studio y JDK 21 para generar la APK (Capacitor 7)

## Inicio rápido

Desde la raíz del repositorio:

```bash
npm install
npm run dev
```

Al crear un Codespace sobre la rama development, el contenedor instala las dependencias y arranca Astro automáticamente. El puerto 4321 se reenvía al navegador. También puedes ejecutar el comando manualmente. Astro sirve la aplicación en el puerto 4321. Para compilar la versión web estática:

```bash
npm run build
```

Para sincronizar la salida web con Android:

```bash
npm run build:android
```

## Usuarios de demostración

| Perfil | PIN |
|---|---|
| Vendedor · Ana | `1234` |
| Supervisor · Luis | `2345` |
| Contabilidad · Marta | `3456` |

Los PIN son exclusivamente de demostración. No reutilices estas credenciales en un entorno real.

## Diseño

La interfaz utiliza una paleta crema (`#F3EEE3`), negro tinta (`#111111`) y naranja quemado (`#D9541E`). Las superficies y controles emplean sombras neumórficas suaves, con contraste y estados visibles.

Consulta `docs/plan/PLAN_FRONTEND.md` y `docs/plan/PLAN_BACKEND.md` antes de modificar contratos o archivos asignados al otro integrante.

## Flujo de Git

El trabajo activo se desarrolla en `development` y entra a `main` mediante Pull Request revisado. Usa ramas `feat/*`, `fix/*` y `docs/*`, con commits `feat:`, `fix:`, `test:`, `docs:` o `chore:`.

## Probar en un teléfono Android

Cada Pull Request dirigido a `development` genera una APK de depuración mediante el workflow **Android preview APK**:

1. Abre el Pull Request en GitHub y entra en la pestaña **Checks**.
2. Espera a que termine el trabajo **android-debug**.
3. En la pestaña **Actions**, abre la ejecución del workflow y descarga el artefacto `control-de-caja-android-debug`.
4. Extrae `app-debug.apk), envíalo al teléfono e instálalo. Android puede pedir autorización para instalar aplicaciones desde el navegador o gestor de archivos.
5. Abre Control de Caja. Para probar esta entrega, utiliza los perfiles demo de arriba.

También puedes generar el proyecto Android localmente con `npm run build:android` y abrirlo con `npx cap open android` desde `apps/mobile`. Necesitas Android Studio, el SDK y JDK 21.

**Importante:** la apertura E2 sí utiliza la base local actual. Los movimientos y el cierre E3/E4 de esta entrega son una vista previa temporal; no persisten al reiniciar ni sustituyen las pruebas de aceptación cuando Backend complete B3 y B4.
