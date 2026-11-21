import type { CashSession, Register, User } from '@caja/domain';
import { formatAmount } from '@caja/domain';
import { roleLabel } from '../../i18n/es';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { EmptyState } from '../../ui/components/EmptyState';
import { SessionStatusCard } from '../../ui/components/SessionStatusCard';

type Props = { user: User; session: CashSession | null; register: Register | null; onOpen: () => void; onAllSessions: () => void; onLogout: () => void; canViewAll: boolean };

export function HomePage({ user, session, register, onOpen, onAllSessions, onLogout, canViewAll }: Props) {
  return <div>
    <AppHeader eyebrow="Panel de operaciones" title={`Hola, ${user.name}.`} user={{ name: user.name, role: roleLabel(user.role), avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onLogout}>Salir ↗</AppButton>} />
    <div className="stack">
      <section className="hero-card"><div className="hero-content"><div className="card-kicker">Tu jornada · Control diario</div><h2 className="hero-title">{session ? 'Tu caja está en marcha.' : 'Cada jornada empieza con claridad.'}</h2><p className="hero-copy">{session ? 'La sesión está abierta y el saldo inicial quedó registrado en el dispositivo.' : 'Abre tu caja para comenzar a registrar la operación de hoy. Tu información queda guardada localmente.'}</p>{session ? <span className="pill" style={{ background: 'rgba(243,238,227,.12)', color: '#d9e6d7' }}><span className="pill-dot" />Sesión activa</span> : <AppButton onClick={onOpen}>＋ Abrir caja <span>↗</span></AppButton>}</div><div className="hero-number">0{session ? '1' : '2'}</div></section>
      <div className="stat-grid">
        <div className="stat-card"><div className="card-kicker">Estado</div><div className="stat-value" style={{ fontSize: 19 }}>{session ? 'Abierta' : 'Sin abrir'}</div><div className="stat-note">Sesión de caja</div></div>
        <div className="stat-card"><div className="card-kicker">Perfil activo</div><div className="stat-value" style={{ fontSize: 19 }}>{roleLabel(user.role)}</div><div className="stat-note">Acceso por permisos</div></div>
        <div className="stat-card"><div className="card-kicker">Almacenamiento</div><div className="stat-value" style={{ fontSize: 19 }}>Local</div><div className="stat-note">Disponible sin conexión</div></div>
      </div>
      <div className="content-grid">
        <div className="stack">
          {session ? <SessionStatusCard session={session} register={register} /> : <Card><div className="section-heading"><div><div className="card-kicker">Siguiente paso</div><h2 className="section-title" style={{ marginTop: 7 }}>Todavía no tienes una caja abierta</h2></div><span style={{ fontSize: 23 }}>↗</span></div><EmptyState icon="＋" title="Prepara tu apertura" description="Registra el efectivo con el que comienzas. La apertura quedará asociada a tu usuario y caja." /><div style={{ marginTop: 16 }}><AppButton block onClick={onOpen}>Abrir caja ahora</AppButton></div></Card>}
        </div>
        <div className="stack">
          <Card paper><div className="card-kicker">Tu espacio de trabajo</div><h2 className="section-title" style={{ fontSize: 19, margin: '9px 0' }}>Operación protegida</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.65, margin: '0 0 16px' }}>Las acciones visibles dependen de tu rol. Los registros se conservan en el dispositivo y la sincronización se incorporará en una etapa posterior.</p><div className="info-row"><span className="info-label">Usuario</span><span className="info-value">{user.name}</span></div><div className="info-row"><span className="info-label">Caja asignada</span><span className="info-value">{register?.name ?? 'Sin asignar'}</span></div></Card>
          {canViewAll && <Card><div className="card-kicker">Supervisión</div><h2 className="section-title" style={{ margin: '8px 0' }}>Vista general de cajas</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6 }}>Consulta las aperturas de todos los usuarios en modo de solo lectura.</p><AppButton variant="secondary" block onClick={onAllSessions}>Ver todas las cajas ↗</AppButton></Card>}
        </div>
      </div>
    </div>
  </div>;
}