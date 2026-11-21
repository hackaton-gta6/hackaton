import type { CashSession, Register, User } from '@caja/domain';
import { formatAmount } from '@caja/domain';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';

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
  const closed = Boolean(previewClosedSession);
  const opened = Boolean(session && !closed);

  return <div className="home-workspace">
    <AppHeader title={`Hola, ${user.name}`} action={<AppButton variant="quiet" onClick={onLogout}>Salir</AppButton>} />
    <div className="home-register-line">
      <span>{register?.name ?? 'Caja sin asignar'}</span>
      <span className={`home-status ${opened ? 'is-open' : closed ? 'is-closed' : 'is-idle'}`}>
        <i />{opened ? 'Abierta' : closed ? 'Cerrada' : 'Sin abrir'}
      </span>
    </div>

    {opened && session ? <Card className="home-primary-panel">
      <div className="home-balance-label">Saldo esperado</div>
      <div className="home-balance">{formatAmount(expectedBalanceMinor)} <small>{session.currency}</small></div>
      <div className="home-activity-line">{movementCount} {movementCount === 1 ? 'movimiento' : 'movimientos'} registrados</div>
      <div className="home-primary-actions">
        <AppButton block onClick={onMovements}>Ver movimientos</AppButton>
        {canOpen && <AppButton block variant="secondary" onClick={onClose}>Cerrar caja</AppButton>}
      </div>
    </Card> : closed ? <Card className="home-primary-panel">
      <div className="home-balance-label">Última operación</div>
      <h2 className="home-panel-title">Caja cerrada</h2>
      <p className="home-panel-copy">Puedes consultar el cierre desde el historial.</p>
      <AppButton block variant="secondary" onClick={onAllSessions}>Ver historial</AppButton>
    </Card> : canOpen ? <Card className="home-primary-panel home-open-panel">
      <div className="home-balance-label">Estado de caja</div>
      <h2 className="home-panel-title">Lista para abrir</h2>
      <p className="home-panel-copy">Registra el efectivo inicial y empieza a operar.</p>
      <AppButton block onClick={onOpen}>Abrir caja</AppButton>
    </Card> : <Card className="home-primary-panel">
      <div className="home-balance-label">Consulta</div>
      <h2 className="home-panel-title">Supervisión de cajas</h2>
      <p className="home-panel-copy">Consulta las sesiones y la actividad de los equipos.</p>
      <AppButton block onClick={onAllSessions}>Ver cajas</AppButton>
    </Card>}

    {canViewAll && <button className="home-text-action" onClick={onAllSessions}>Consultar todas las cajas <span>→</span></button>}
  </div>;
}
