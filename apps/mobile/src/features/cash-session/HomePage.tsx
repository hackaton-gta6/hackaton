import type { CashSession, Register, User } from '@caja/domain';
import { formatAmount } from '@caja/domain';
import { roleLabel } from '../../i18n/es';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { EmptyState } from '../../ui/components/EmptyState';
import { SessionStatusCard } from '../../ui/components/SessionStatusCard';

type Props = {
  user: User;
  session: CashSession | null;
  register: Register | null;
  onOpen: () => void;
  onAllSessions: () => void;
  onLogout: () => void;
  onMovements: () => void;
  onClose: () => void;
  canViewAll: boolean;
  canOpen: boolean;
  expectedBalanceMinor: number;
  movementCount: number;
  previewClosedSession?: CashSession | null;
};

export function HomePage({ user, session, register, onOpen, onAllSessions, onLogout, onMovements, onClose, canViewAll, canOpen, expectedBalanceMinor, movementCount, previewClosedSession }: Props) {
  const previewClosed = Boolean(previewClosedSession);
  return <div>
    <AppHeader eyebrow="Panel de operaciones" title={`Hola, ${user.name}.`} user={{ name: user.name, role: roleLabel(user.role), avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onLogout}>Salir ↗</AppButton>} />
    <div className="stack">
      <section className="hero-card"><div className="hero-content"><div className="card-kicker">Tu jornada · Control diario</div><h2 className="hero-title">{previewClosed ? 'Tu jornada ha terminado.' : session ? 'Tu caja está en marcha.' : canOpen ? 'Cada jornada empieza con claridad.' : 'Una visión completa de la operación.'}</h2><p className="hero-copy">{previewClosed ? 'El cierre de demostración está listo para revisar en el historial.' : session ? 'Registra cada entrada y salida. El saldo esperado se actualiza con la actividad de la caja.' : canOpen ? 'Abre tu caja para comenzar a registrar la operación de hoy. Tu información queda guardada localmente.' : 'Consulta las sesiones de caja y supervisa la actividad de los equipos desde un perfil de solo lectura.'}</p>{session && !previewClosed ? <AppButton onClick={onMovements}>Ver movimientos <span>↗</span></AppButton> : previewClosed ? <span className="pill" style={{ background: 'rgba(243,238,227,.12)', color: '#e8d7c7' }}>Cierre de vista previa</span> : canOpen ? <AppButton onClick={onOpen}>＋ Abrir caja <span>↗</span></AppButton> : <span className="pill" style={{ background: 'rgba(243,238,227,.12)', color: '#e8d7c7' }}>Acceso de consulta</span>}</div><div className="hero-number">0{previewClosed ? '4' : session ? '3' : '2'}</div></section>
      <div className="stat-grid">
        <div className="stat-card"><div className="card-kicker">Estado</div><div className="stat-value" style={{ fontSize: 19 }}>{previewClosed ? 'Cerrada' : session ? 'Abierta' : canOpen ? 'Sin abrir' : 'Consulta'}</div><div className="stat-note">Sesión de caja</div></div>
        <div className="stat-card"><div className="card-kicker">Perfil activo</div><div className="stat-value" style={{ fontSize: 19 }}>{roleLabel(user.role)}</div><div className="stat-note">Acceso por permisos</div></div>
        <div className="stat-card"><div className="card-kicker">Movimientos</div><div className="stat-value" style={{ fontSize: 19 }}>{movementCount.toString().padStart(2, '0')}</div><div className="stat-note">En esta vista de desarrollo</div></div>
      </div>
      <div className="content-grid">
        <div className="stack">
          {previewClosed && <Card><div className="card-kicker">Cierre de prueba</div><h2 className="section-title" style={{ margin: '9px 0' }}>Caja cerrada en la vista previa</h2><div className="stat-value">{formatAmount(previewClosedSession?.countedBalanceMinor ?? 0)} CUP</div><p className="section-subtitle">La sesión real permanece abierta en el almacenamiento local hasta integrar el cierre del Backend.</p></Card>}
          {!previewClosed && session ? <><SessionStatusCard session={session} register={register} /><Card><div className="section-heading"><div><div className="card-kicker">Control de efectivo</div><h2 className="section-title" style={{ marginTop: 7 }}>Saldo esperado</h2></div><span className="pill">Actualizado</span></div><div className="amount-big">{formatAmount(expectedBalanceMinor)} <span style={{ fontSize: 12 }}>CUP</span></div><div className="section-subtitle">{movementCount} movimientos registrados en esta vista de desarrollo.</div><div className="home-action-row"><AppButton variant="secondary" onClick={onMovements}>Ver actividad</AppButton><AppButton onClick={onClose}>Cerrar caja</AppButton></div></Card></> : !previewClosed && canOpen ? <Card><div className="section-heading"><div><div className="card-kicker">Siguiente paso</div><h2 className="section-title" style={{ marginTop: 7 }}>Todavía no tienes una caja abierta</h2></div><span style={{ fontSize: 23 }}>↗</span></div><EmptyState icon="＋" title="Prepara tu apertura" description="Registra el efectivo con el que comienzas. La apertura quedará asociada a tu usuario y caja." /><div style={{ marginTop: 16 }}><AppButton block onClick={onOpen}>Abrir caja ahora</AppButton></div></Card> : <Card><div className="card-kicker">Vista de contabilidad</div><h2 className="section-title" style={{ margin: '9px 0' }}>Seguimiento de sesiones</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.65 }}>Tu perfil permite consultar las aperturas de todos los usuarios, sin modificar sus cajas.</p><AppButton variant="secondary" block onClick={onAllSessions}>Consultar todas las cajas ↗</AppButton></Card>}
        </div>
        <div className="stack">
          <Card paper><div className="card-kicker">Tu espacio de trabajo</div><h2 className="section-title" style={{ fontSize: 19, margin: '9px 0' }}>Operación protegida</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.65, margin: '0 0 16px' }}>Las acciones visibles dependen de tu rol. Los registros reales se conservan en el dispositivo; los movimientos y cierres nuevos son una vista previa hasta recibir el Backend.</p><div className="info-row"><span className="info-label">Usuario</span><span className="info-value">{user.name}</span></div><div className="info-row"><span className="info-label">Caja asignada</span><span className="info-value">{register?.name ?? 'Sin asignar'}</span></div></Card>
          {canViewAll && <Card><div className="card-kicker">Supervisión</div><h2 className="section-title" style={{ margin: '8px 0' }}>Vista general de cajas</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6 }}>Consulta las aperturas de todos los usuarios en modo de solo lectura.</p><AppButton variant="secondary" block onClick={onAllSessions}>Ver todas las cajas ↗</AppButton></Card>}
        </div>
      </div>
    </div>
  </div>;
}