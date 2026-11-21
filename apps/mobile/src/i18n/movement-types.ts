import type { MovementType } from '@caja/domain';

export const movementTypeLabels: Record<MovementType, string> = {
  sale: 'Venta',
  collection: 'Cobro',
  other_income: 'Otro ingreso',
  refund: 'Reembolso',
  operating_expense: 'Gasto operativo',
  salary_payment: 'Pago de salario',
  other_expense: 'Otro egreso',
  payment: 'Pago',
  transfer_out: 'Transferencia enviada',
  transfer_in: 'Transferencia recibida',
  reversal: 'Anulación',
};

export const movementTypeDescriptions: Partial<Record<MovementType, string>> = {
  sale: 'Efectivo recibido por una venta',
  collection: 'Cobro de una cuenta pendiente',
  other_income: 'Entrada de efectivo no clasificada',
  refund: 'Devolución de dinero al cliente',
  operating_expense: 'Gasto necesario para la operación',
  salary_payment: 'Pago de salarios autorizado al supervisor',
  other_expense: 'Salida de efectivo de otra naturaleza',
};

export const movementTypeIcons: Record<MovementType, string> = {
  sale: '↗',
  collection: '↓',
  other_income: '+',
  refund: '↩',
  operating_expense: '−',
  salary_payment: '₰',
  other_expense: '↘',
  payment: '¤',
  transfer_out: '⇢',
  transfer_in: '⇠',
  reversal: '↶',
};

export const movementTypeDirection: Record<MovementType, 'in' | 'out'> = {
  sale: 'in',
  collection: 'in',
  other_income: 'in',
  refund: 'out',
  operating_expense: 'out',
  salary_payment: 'out',
  other_expense: 'out',
  payment: 'out',
  transfer_out: 'out',
  transfer_in: 'in',
  reversal: 'out',
};