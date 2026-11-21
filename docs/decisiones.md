# Decisiones técnicas

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Monorepo npm workspaces | Comparte contratos y facilita probar el conjunto | Repositorios separados |
| React + Capacitor | Interfaz dinámica y distribución Android | App nativa separada |
| Astro como shell estático | Entrega estática eficiente y separación entre shell y aplicación interactiva | Renderizar todo el cliente como HTML generado por Vite |
| Dexie para persistencia local | IndexedDB tipado y consultas observables | Acceso directo a IndexedDB |
| Fastify para el ERP simulado | API pequeña para pruebas de integración | Servidor acoplado a la app |
| Dinero en centavos enteros | Evita errores de coma flotante | Importes decimales |
| Paleta crema, tinta y naranja | Contraste cálido, identidad clara y acento operativo | Celadon como color dominante |
| Neomorfismo moderado | Da tactilidad a controles y tarjetas sin sacrificar contraste | Sombras decorativas intensas en todos los elementos |

La UI sigue el contrato del dominio. Los cambios de reglas o de estructura de datos deben revisarse con el integrante responsable de Backend.
