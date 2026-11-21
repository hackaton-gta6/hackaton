import type { CashSession, Register } from '@caja/domain';
import { formatAmount } from '@caja/domain';
import { Card } from './Card';

type Props = { session: CashSession; register?: Register | null; compact?: boolean };

export function SessionStatusCard({ session, register, compact = false }: Props) {
  const opened = new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(session.openedAt));
  return <Card className={compact ? 'session-status compact' : 'session-status'}>
    <div className="section-heading"><div><div className="card-kicker">Estado de caja</div><h2 className="section-title" style={{ marginTop: 7 }}>{register?.name ?? 'Caja asignada'}</h2></div><span className="pill"><span className="pill-dot" />Abierta</span></div>
    <div className="amount-caption">Saldo inicial</div>
    <div className="amount-big" style={{ margin: '7px 0 17px' }}>{formatAmount(session.openingBalanceMinor)} <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 0 }}>CUP</span></div>
    <div className="info-row"><span className="info-label">Apertura</span><span className="info-value">{opened}</span></div>
    {!compact && <div className="info-row"><span className="info-label">Identificador</span><span className="info-value">{session.id.slice(0, 8).toUpperCase()}</span></div>}
  </Card>;
}