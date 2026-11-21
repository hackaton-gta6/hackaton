export const es = {
  appName: 'Control de Caja',
  roles: { cashier: 'Vendedor', supervisor: 'Supervisor', accountant: 'Contabilidad' },
  errors: {
    USER_NOT_FOUND: 'No encontramos este usuario.',
    PIN_INVALID_FORMAT: 'El PIN debe tener 4 dígitos.',
    PIN_WRONG: 'El PIN no es correcto.',
    PIN_LOCKED: 'Has alcanzado el límite de intentos. Espera antes de volver a probar.',
    PERMISSION_DENIED: 'Tu perfil no tiene permiso para realizar esta acción.',
    OPENING_BALANCE_INVALID: 'Introduce un saldo inicial válido, igual o mayor que cero.',
    SESSION_ALREADY_OPEN: 'Ya tienes una caja abierta.',
    UNEXPECTED: 'No se pudo completar la operación. Inténtalo de nuevo.'
  }
} as const;

export function roleLabel(role: keyof typeof es.roles): string { return es.roles[role]; }