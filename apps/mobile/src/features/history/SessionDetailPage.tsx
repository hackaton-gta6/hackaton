import { formatAmount, type CashSession, type Movement, type User } from '@caja/domain';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { MovementListItem } from '../movements/MovementListItem';

type Props = { user: User; session: CashSession; movements: Movement[]; onBack: () => void; onMovement: (movement: Movement) => void };

export function SessionDetailPage({ user, session, movements, onBack, onMovement }: Props) {
  return <div>
    <AppHeader eyebrow="E4 · Historial de sesión" title="Jornada cerrada" user={{ name: user.name, role: user.role === 'cashier' ? 'Vendedor' : user.role === 'supervisor' ? 'Supervisor' : 'Contabilidad', avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onBack}>← Volver</AppButton>} />
    <div className="detail-layout"><Card><div className="card-kicker">Resumen de la jornada</div><div className="detail-amount">{formatAmount(session.countedBalanceMinor ?? 0)} <small>{session.currency}</small></div><div className="info-row"><span className="info-label">Apertura</span><strong className="info-value">{new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(session.openedAt))}</strong></div><div className="info-row"><span className="info-label">Cierre</span><strong className="info-value">{session.closedAt ? new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(session.closedAt)) : '—'}</strong></div><div className="info-row"><span className="info-label">Saldo esperado</span><strong className="info-value">{formatAmount(session.expectedBalanceMinor ?? 0)}</strong></div><div className="info-row"><span className="info-label">Diferencia</span><strong className="info-value">{formatAmount(Math.abs(session.varianceMinor ?? 0))}</strong></div><div className="info-row"><span className="info-label">Nota</span><strong className="info-value">{session.varianceNote ?? 'Sin diferencia'}</strong></div></Card>
    <Card><div className="card-kicker">Libro de caja</div><h2 className="section-title" style={{ margin: '8px 0 16px' }}>Movimientos ({movements.length})</h2>{movements.length ? <div className="movement-list">{movements.map((movement) => <MovementListItem key={movement.id} movement={movement} onClick={() => onMovement(movement)} />)}</div> : <p className="section-subtitle">Esta sesión no tiene movimientos registrados.</p>}</Card></div>
  </div>;
}