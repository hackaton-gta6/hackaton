import { formatAmount, type Movement } from '@caja/domain';
import { movementTypeDirection, movementTypeIcons, movementTypeLabels } from '../../i18n/movement-types';
import { SyncBadge } from '../../ui/components/SyncBadge';

type Props = { movement: Movement; onClick: () => void };

export function MovementListItem({ movement, onClick }: Props) {
  const direction = movementTypeDirection[movement.type as keyof typeof movementTypeDirection] ?? movement.direction;
  const label = movementTypeLabels[movement.type as keyof typeof movementTypeLabels] ?? 'Movimiento';
  const icon = movementTypeIcons[movement.type as keyof typeof movementTypeIcons] ?? '·';
  const date = new Intl.DateTimeFormat('es-CU', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Havana' }).format(new Date(movement.occurredAt));
  return <button type="button" className="movement-list-item" onClick={onClick}>
    <span className={`movement-list-icon movement-${direction}`}>{icon}</span>
    <span className="movement-list-main"><strong>{movement.description}</strong><small>{label} · {date}</small><SyncBadge status={movement.syncStatus} /></span>
    <span className={`movement-list-amount ${direction}`}>{direction === 'in' ? '+' : '−'}{formatAmount(movement.amountMinor)}<small>CUP</small></span>
    <span className="movement-list-arrow">↗</span>
  </button>;
}