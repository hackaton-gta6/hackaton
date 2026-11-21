import { canCreateMovementType, type MovementType, type Role } from '@caja/domain';
import { movementTypeDescriptions, movementTypeDirection, movementTypeIcons, movementTypeLabels } from '../../i18n/movement-types';

const types: MovementType[] = ['sale', 'collection', 'other_income', 'refund', 'operating_expense', 'salary_payment', 'other_expense'];

type Props = { role: Role; value: MovementType | null; onChange: (type: MovementType) => void };

export function MovementTypePicker({ role, value, onChange }: Props) {
  const allowed = types.filter((type) => canCreateMovementType(role, type));
  const income = allowed.filter((type) => movementTypeDirection[type] === 'in');
  const expenses = allowed.filter((type) => movementTypeDirection[type] === 'out');
  const group = (title: string, items: MovementType[]) => <section className="movement-type-group">
    <div className="movement-group-title">{title}<span>{items.length.toString().padStart(2, '0')}</span></div>
    <div className="movement-type-grid">{items.map((type) => <button key={type} type="button" className={`movement-type-option ${value === type ? 'selected' : ''}`} onClick={() => onChange(type)}>
      <span className={`movement-type-symbol movement-${movementTypeDirection[type]}`}>{movementTypeIcons[type]}</span>
      <span className="movement-type-copy"><strong>{movementTypeLabels[type]}</strong><small>{movementTypeDescriptions[type] ?? 'Movimiento de caja'}</small></span>
      <span className="movement-type-check">{value === type ? '✓' : '↗'}</span>
    </button>)}</div>
  </section>;
  return <div className="movement-type-picker">{group('Entradas de efectivo', income)}{group('Salidas de efectivo', expenses)}</div>;
}