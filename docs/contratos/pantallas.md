# Contrato de pantallas — E2 y vista previa E3/E4

Este documento refleja las pantallas disponibles en la rama de desarrollo. E2 usa los servicios locales reales disponibles en el repositorio. E3 y E4 tienen una primera implementación visual e interactiva, pero sus escrituras siguen siendo simuladas hasta recibir los repositorios y reglas B3/B4.

| Pantalla | Ruta interna | Roles | Datos y acciones | Estados |
|---|---|---|---|---|
| Acceso | Login | Vendedor, Supervisor, Contabilidad | `UserRepository.listDemoUsers`, `verifyPin` | Cargando, error de PIN, acceso correcto |
| Inicio | Home | Todos | `SessionRepository.watchOpenForUser`, `RegisterRepository.getById`; acceso a apertura, movimientos y cierre | Sin caja, caja abierta, cierre de vista previa, consulta |
| Abrir caja | Open session | Vendedor, Supervisor | `SessionRepository.openSession`, `RegisterRepository.getById`, `parseAmount` | Validación de importe, confirmación, guardado real, error de dominio |
| Todas las cajas | All sessions | Supervisor, Contabilidad | `SessionRepository.watchAll`, `UserRepository.listDemoUsers`, `RegisterRepository.list` | Cargando, vacío, listado en solo lectura |
| Nuevo movimiento | New movement | Vendedor, Supervisor | Vista previa: catálogo temporal, `parseAmount`; integración pendiente con `MovementRepository.add` y `validateNewMovement` | Tipo, formulario, revisión, validación local |
| Movimientos | Movements | Vendedor, Supervisor; Contabilidad solo lectura | Vista previa: lista en memoria, filtros, resumen temporal; integración pendiente con `watchBySession` y `summarizeSession` | Vacío, lista, filtros, saldo esperado de vista previa |
| Detalle de movimiento | Movement detail | Vendedor, Supervisor; Contabilidad solo lectura | Vista previa de `Movement`; integración pendiente con `getById` y `AuditRepository.listByEntity` | Detalle, estado local, auditoría pendiente |
| Conteo y cierre | Closing | Vendedor, Supervisor | Vista previa: `CashCounter`, diferencia y nota; integración pendiente con `SessionRepository.closeSession`, `validateClose`, `computeVariance` y `totalFromDenominations` | Total directo, desglose, cuadrada, faltante, sobrante, confirmación |
| Resumen de cierre | Closing summary | Vendedor, Supervisor | Vista previa de informe; integración pendiente con `buildSessionReport` y compartir nativo | Resumen, diferencia, compartir |
| Historial | Session history | Vendedor (propio), Supervisor y Contabilidad (todos) | Vista previa: cierres realizados durante la sesión de prueba; integración pendiente con `listByUser` / `listAll` filtrado por `closed` | Vacío, listado |
| Detalle de sesión cerrada | Session detail | Según permisos de historial | Vista previa de sesión y movimientos en solo lectura | Detalle, movimientos, nota de cierre |
| Perfil | Integrado en navegación | Todos | `SettingsRepository` para usuario activo; cierre de sesión | Sesión restaurada, cierre de sesión |

## Reglas de interfaz

- La UI no escribe directamente en Dexie; usa servicios/repositorios o adaptadores de vista previa claramente identificados.
- Los importes se convierten mediante `parseAmount` y se expresan como centavos enteros.
- La caja asignada se muestra como solo lectura.
- Contabilidad consulta todas las cajas, pero no puede abrir ni registrar movimientos.
- Un usuario con una sesión abierta no recibe una segunda acción de apertura.
- Los movimientos son inmutables en la UI; no se ofrece edición.
- El saldo esperado visible en E3 se calcula con el efectivo inicial más ingresos menos egresos, incluyendo los movimientos locales.
- El cierre exige nota cuando hay faltante o sobrante. Una caja cerrada se presenta en modo de solo lectura.
- El estado de sincronización siempre lleva texto e icono; nunca depende solo del color.
- Las denominaciones actuales son provisionales: Backend debe confirmar la lista vigente antes de cerrar B4.
- Las acciones de movimiento y cierre de esta entrega son temporales en memoria y se identifican como vista de desarrollo. No deben confundirse con persistencia real ni usarse para una prueba de aceptación de etapa.
- En Android, la navegación principal se presenta abajo y respeta el área segura del dispositivo.
- Los textos de interfaz se mantienen en `src/i18n/`; no se introducen textos visibles en el dominio.
