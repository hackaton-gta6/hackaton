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
| Símbolo C/c en forma de billete | Una C principal y una c invertida construyen un gesto continuo similar a una S; el contorno recuerda un billete sin recurrir a iconografía bancaria genérica | Monograma literal «CC» |
| Navegación inferior en Android | Mantiene las acciones principales al alcance del pulgar y evita depender de un menú lateral oculto | Sidebar comprimida como única navegación móvil |

## Identidad visual fijada

- Crema: `#F3EEE3`, superficie principal.
- Ink Black: `#111111`, texto, estructura y acciones principales.
- Burnt Orange: `#D9541E`, acento puntual para selección, foco y estados que requieren atención.
- El blanco puro no se utiliza como fondo dominante.
- El relieve neumórfico aparece en controles interactivos, selectores y estados presionados; no se aplica indiscriminadamente a cada contenedor.
- La jerarquía visual prioriza saldo esperado, acción principal y estado de caja. Los detalles secundarios quedan en segundo plano.

La UI sigue el contrato del dominio. Los cambios de reglas o de estructura de datos deben revisarse con el integrante responsable de Backend.
