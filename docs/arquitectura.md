# Arquitectura

El repositorio usa un monorepo con tres áreas: dominio compartido, aplicación móvil offline-first y servidor ERP simulado. La aplicación guarda los datos localmente, los representa en una cola de salida y los sincroniza mediante lotes con el servidor.

- `packages/domain`: modelos, reglas, permisos y contratos independientes de infraestructura.
- `apps/mobile`: interfaz React, shell web estático Astro, almacenamiento Dexie, cola y cliente HTTP.
- `apps/server`: API Fastify, persistencia SQLite y reglas de aceptación del ERP simulado.

## Presentación web y aplicación móvil

Astro genera una salida estática ligera. La pantalla de aplicación React se monta como una isla `client:only`, evitando ejecutar Dexie o APIs del navegador durante el renderizado del servidor. Esta separación permite servir HTML y recursos estáticos eficientemente, mientras que React conserva el estado y la interacción de la aplicación.

La configuración de compilación divide los recursos de React y Dexie en chunks independientes y permite cargar la interfaz desde la misma salida `dist` que consume Capacitor. Astro no sustituye a React ni a Capacitor: organiza la entrega web y deja la lógica operativa en la aplicación React.

## Límites de dependencia

- La UI consume los servicios/repositorios y no accede directamente a Dexie ni a `fetch`.
- `packages/domain` no depende de React, DOM, almacenamiento ni red.
- El servidor es una simulación del ERP para pruebas de integración y demostración.

## Firma

La APK de demostración se firma mediante un keystore estable. En un entorno de entrega se recomienda guardar el keystore y sus credenciales como GitHub Secrets; cualquier keystore público de demostración debe declararse expresamente como no secreto.
