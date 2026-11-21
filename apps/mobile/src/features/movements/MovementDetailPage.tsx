import { formatAmount, type Movement, type User } from '@caja/domain';
import { movementTypeLabels } from '../../i18n/movement-types';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { SyncBadge } from '../../ui/components/SyncBadge';

type Props = { movement: Movement; user: User; onBack: () => void };

export function MovementDetailPage({ movement, user, onBack }: Props) {
  const label = movementTypeLabels[movement.type as keyof typeof movementTypeLabels] ?? 'Movimiento';
  const date = new Intl.DateTimeFormat('es-CU', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(movement.occurredAt));
  return <div>
    <AppHeader eyebrow="E3 · Registro de caja" title="Detalle del movimiento" user={{ name: user.name, role: user.role === 'cashier' ? 'Vendedor' : user.role === 'supervisor' ? 'Supervisor' : 'Contabilidad', avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onBack}>← Volver</AppButton>} />
    <div className="detail-layout"><Card>
      <div className="card-kicker">{label}</div><div className={`detail-amount ${movement.direction}`}>{movement.direction === 'in' ? '+' : '−'}{formatAmount(movement.amountMinor)} <small>{movement.currency}</small></div>
      <p className="detail-description">{movement.description}</p><SyncBadge status={movement.syncStatus} />
      <div className="detail-divider" />
      <div className="info-row"><span className="info-label">Fecha y hora</span><strong className="info-value">{date}</strong></div>
      <div className="info-row"><span className="info-label">Registrado por</span><strong className="info-value">{user.name}</strong></div>
      <div className="info-row"><span className="info-label">Referencia</span><strong className="info-value">{movement.reference ?? '—'}</strong></div>
      <div className="info-row"><span className="info-label">Identificador</span><strong className="info-value detail-id">{movement.id}</strong></div>
    </Card><Card paper><div className="card-kicker">Trazabilidad</div><h2 className="section-title" style={{ margin: '8px 0 15px' }}>Historial del registro</h2><div className="timeline-item"><span className="timeline-dot" /><div><strong>Movimiento creado</strong><small>{date}</small><p>El registro se conserva en este dispositivo.</p></div></div><p className="section-subtitle" style={{ lineHeight: 1.6 }}>La auditoría completa se conectará cuando el Backend entregue el repositorio de auditoría de movimientos.</p></Card></div>
  </div>;
}