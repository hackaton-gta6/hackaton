# Control de Caja

Aplicación móvil offline-first para el control operativo de efectivo. El cliente está construido con React y Capacitor; Astro genera la capa web estática que carga la experiencia React como una isla de cliente. El servidor del repositorio es una **simulación del ERP**, no un sistema bancario ni un ERP real.

## Estructura

- `packages/domain`: reglas, tipos, permisos y contratos compartidos.
- `apps/mobile`: aplicación React + Astro + Capacitor, con almacenamiento local Dexie.
- `apps/server`: servidor ERP simulado con Fastify y SQLite.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- Android Studio y JDK 17 para generar la APK

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
