import { formatAmount, type CashSession, type User } from '@caja/domain';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { EmptyState } from '../../ui/components/EmptyState';

type Props = { user: User; sessions: CashSession[]; onBack: () => void; onSelect: (session: CashSession) => void };

export function SessionHistoryPage({ user, sessions, onBack, onSelect }: Props) {
  const visible = user.role === 'cashier' ? sessions.filter((session) => session.userId === user.id) : sessions;
  return <div>
    <AppHeader eyebrow="E4 · Consulta" title="Historial de cajas" user={{ name: user.name, role: user.role === 'cashier' ? 'Vendedor' : user.role === 'supervisor' ? 'Supervisor' : 'Contabilidad', avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onBack}>← Volver</AppButton>} />
    <Card><div className="section-heading"><div><div className="card-kicker">Jornadas finalizadas</div><h2 className="section-title" style={{ marginTop: 7 }}>Cierres registrados</h2></div><span className="pill">{visible.length} sesiones</span></div>
      {visible.length === 0 ? <EmptyState icon="◷" title="Todavía no hay cierres" description="Las sesiones cerradas aparecerán aquí para su consulta." /> : <div className="history-list">{visible.slice().sort((a,b) => (b.closedAt ?? '').localeCompare(a.closedAt ?? '')).map((session) => <button className="history-row" key={session.id} onClick={() => onSelect(session)}><span className="history-date"><strong>{session.closedAt ? new Intl.DateTimeFormat('es-CU', { day: '2-digit', month: 'short', timeZone: 'America/Havana' }).format(new Date(session.closedAt)) : '—'}</strong><small>{session.closedAt ? new Intl.DateTimeFormat('es-CU', { year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Havana' }).format(new Date(session.closedAt)) : 'Sin fecha'}</small></span><span className="history-main"><strong>{session.userId === user.id ? 'Tu jornada' : 'Sesión de caja'}</strong><small>{session.status === 'closed' ? 'Cerrada' : 'Abierta'} · {session.currency}</small></span><span className="history-amount"><strong>{formatAmount(session.countedBalanceMinor ?? session.openingBalanceMinor)}</strong><small>CUP contado</small></span><span>↗</span></button>)}</div>}
    </Card>
  </div>;
}