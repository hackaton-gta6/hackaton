import { useEffect, useState } from 'react';
import type { CashSession, Register, User } from '@caja/domain';
import { formatAmount } from '@caja/domain';
import type { Services } from '../../app/App';
import { roleLabel } from '../../i18n/es';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { EmptyState } from '../../ui/components/EmptyState';

type Props = { services: Services; user: User; onBack: () => void };

export function AllSessionsPage({ services, user, onBack }: Props) {
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [registers, setRegisters] = useState<Register[]>([]);
  useEffect(() => {
    const unsubscribe = services.sessions.watchAll(setSessions);
    void Promise.all([services.users.listDemoUsers(), services.registers.list()]).then(([loadedUsers, loadedRegisters]) => { setUsers(loadedUsers); setRegisters(loadedRegisters); });
    return unsubscribe;
  }, [services]);
  const userById = new Map(users.map((item) => [item.id, item]));
  const registerById = new Map(registers.map((item) => [item.id, item]));
  return <div>
    <AppHeader eyebrow="Supervisión · Solo lectura" title="Todas las cajas" user={{ name: user.name, role: roleLabel(user.role), avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onBack}>← Volver</AppButton>} />
    <Card>
      <div className="section-heading"><div><div className="card-kicker">Actividad de sesiones</div><h2 className="section-title" style={{ marginTop: 7 }}>Aperturas registradas</h2><div className="section-subtitle">Consulta las cajas asignadas a cada usuario.</div></div><span className="pill">{sessions.length} registros</span></div>
      {sessions.length === 0 ? <EmptyState icon="▤" title="Todavía no hay aperturas" description="Cuando un usuario abra su caja, la sesión aparecerá aquí." /> : <div className="session-list">{sessions.map((session) => {
        const owner = userById.get(session.userId);
        const register = registerById.get(session.registerId);
        const opened = new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(session.openedAt));
        return <div className="session-row" key={session.id}><div><div className="session-row-title">{owner?.name ?? 'Usuario'} · {register?.name ?? 'Caja'}</div><div className="session-row-meta">{owner ? roleLabel(owner.role) : ''} · {opened}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: 13, fontWeight: 850, fontVariantNumeric: 'tabular-nums' }}>{formatAmount(session.openingBalanceMinor)} CUP</div><div className="session-row-meta">Saldo inicial</div></div></div>;
      })}</div>}
    </Card>
  </div>;
}