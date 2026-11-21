# Contrato de pantallas — versión E2

Este documento registra las pantallas que ya están implementadas en la entrega frontend E2. Las pantallas futuras se mantienen en el plan y se incorporarán en sus etapas correspondientes.

| Pantalla | Ruta interna | Roles | Datos y acciones | Estados |
|---|---|---|---|---|
| Acceso | Login | Vendedor, Supervisor, Contabilidad | UserRepository.listDemoUsers, verifyPin | Cargando, error de PIN, acceso correcto |
| Inicio | Home | Todos | SessionRepository.watchOpenForUser, RegisterRepository.getById; acceso a apertura o consulta general | Cargando, sin caja, caja abierta, consulta |
| Abrir caja | Open session | Vendedor, Supervisor | SessionRepository.openSession, RegisterRepository.getById, parseAmount | Validación de importe, confirmación, guardado, error de dominio |
| Todas las cajas | All sessions | Supervisor, Contabilidad | SessionRepository.watchAll, UserRepository.listDemoUsers, RegisterRepository.list | Cargando, vacío, listado en solo lectura |
| Perfil | Integrado en navegación | Todos | SettingsRepository para usuario activo; cierre de sesión | Sesión restaurada, cierre de sesión |

## Reglas de interfaz

- La UI no escribe directamente en Dexie; usa los servicios y repositorios existentes.
- Los importes se convierten mediante parseAmount y se guardan como centavos enteros.
- La caja asignada se muestra como solo lectura.
- Contabilidad consulta todas las cajas, pero no puede abrir una.
- Un usuario con una sesión abierta no recibe una segunda acción de apertura.
- Los botones de movimientos y cierre no se muestran hasta E3 y E4.
- Los errores de dominio se traducen en español en src/i18n/es.ts.
