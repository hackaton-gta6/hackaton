import { useEffect, useMemo, useState } from 'react';
import type { CashSession, Movement, Register, User } from '@caja/domain';
import { createServices } from '../data';
import type { Services as DataServices } from '../data/create-services';
import { es } from '../i18n/es';
import { movementTypeDirection } from '../i18n/movement-types';
import { LoginPage } from '../features/auth/LoginPage';
import { AllSessionsPage } from '../features/cash-session/AllSessionsPage';
import { HomePage } from '../features/cash-session/HomePage';
import { OpenSessionPage } from '../features/cash-session/OpenSessionPage';
import type { MovementDraft } from '../features/movements/MovementForm';
import { MovementsPage } from '../features/movements/MovementsPage';
import { NewMovementPage } from '../features/movements/NewMovementPage';
import { MovementDetailPage } from '../features/movements/MovementDetailPage';
import { ClosingPage } from '../features/closing/ClosingPage';
import { ClosingSummaryPage } from '../features/closing/ClosingSummaryPage';
import { summarizePreview } from '../features/closing/closing-preview';
import type { ClosingPreview } from '../features/closing/closing-preview';
import { SessionHistoryPage } from '../features/history/SessionHistoryPage';
import { SessionDetailPage } from '../features/history/SessionDetailPage';
import { BrandLockup } from '../ui/components/BrandLockup';
import { Card } from '../ui/components/Card';

export type Services = DataServices;
type View = 'home' | 'open' | 'all-sessions' | 'movements' | 'new-movement' | 'movement-detail' | 'closing' | 'closing-summary' | 'history' | 'history-detail';

export default function App() {
  const [services, setServices] = useState<Services | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [session, setSession] = useState<CashSession | null>(null);
  const [register, setRegister] = useState<Register | null>(null);
  const [view, setView] = useState<View>('home');
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [previewClosing, setPreviewClosing] = useState<ClosingPreview | null>(null);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [selectedHistorySession, setSelectedHistorySession] = useState<CashSession | null>(null);

  useEffect(() => {
    let active = true;
    void createServices().then(async (created) => {
      const [availableUsers, activeUserId] = await Promise.all([created.users.listDemoUsers(), created.settings.get('activeUserId')]);
      if (!active) return;
      setServices(created);
      setUsers(availableUsers);
      if (activeUserId) {
        const restored = await created.users.getById(activeUserId);
        if (restored) setUser(restored);
      }
      setLoading(false);
    }).catch((error: unknown) => {
      console.error('No se pudo iniciar Control de Caja', error);
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!services || !user) return;
    let mounted = true;
    const stop = services.sessions.watchOpenForUser(user.id, (next) => { if (mounted) setSession(next); });
    void services.registers.getById(user.registerId ?? '').then((next) => { if (mounted) setRegister(next); });
    return () => { mounted = false; stop(); };
  }, [services, user]);

  const login = async (userId: string, pin: string) => {
    if (!services) return;
    setBusy(true);
    setLoginError('');
    const result = await services.users.verifyPin(userId, pin);
    setBusy(false);
    if (!result.ok) {
      const error = result.errors[0];
      const code = error.code as keyof typeof es.errors;
      const remaining = error.params?.remainingAttempts;
      const seconds = error.params?.remainingSeconds;
      const message = es.errors[code] ?? 'No se pudo validar el acceso.';
      setLoginError(code === 'PIN_WRONG' && typeof remaining === 'number' ? `${message} Te quedan ${remaining} intentos.` : code === 'PIN_LOCKED' && typeof seconds === 'number' ? `${message} Tiempo restante: ${seconds} s.` : message);
      return;
    }
    setUser(result.value);
    setView('home');
  };

  const logout = async () => {
    if (services) await services.settings.set('activeUserId', '');
    setUser(null);
    setSession(null);
    setMovements([]);
    setPreviewClosing(null);
    setSelectedMovement(null);
    setSelectedHistorySession(null);
    setView('home');
  };

  const canViewAll = user ? user.role === 'supervisor' || user.role === 'accountant' : false;
  const canOpen = user ? user.role === 'cashier' || user.role === 'supervisor' : false;
  const summary = useMemo(() => session ? summarizePreview(session, movements) : { incomeMinor: 0, expenseMinor: 0, expectedBalanceMinor: 0 }, [session, movements]);

  const openSession = async (openingUser: User, amountMinor: number) => {
    if (!services) return { ok: false, errors: [{ code: 'UNEXPECTED' }] };
    const result = await services.sessions.openSession(openingUser, amountMinor);
    if (result.ok) { setSession(result.value); setMovements([]); setPreviewClosing(null); }
    return result;
  };

  const createMovement = (draft: MovementDraft) => {
    if (!user || !session || previewClosing) return;
    const movement: Movement = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      userId: user.id,
      type: draft.type,
      direction: movementTypeDirection[draft.type],
      amountMinor: draft.amountMinor,
      currency: session.currency,
      description: draft.description,
      occurredAt: draft.occurredAt,
      createdAt: new Date().toISOString(),
      reference: draft.reference,
      counterparty: null,
      counterpartyRegisterId: null,
      reversalOf: null,
      reversedBy: null,
      reversalReason: null,
      syncStatus: 'local',
    };
    setMovements((current) => [movement, ...current]);
    setView('movements');
  };

  const completePreviewClosing = (closing: ClosingPreview) => {
    setPreviewClosing(closing);
    setView('closing-summary');
  };

  if (loading) return <div className="loading-screen">Preparando tu espacio de trabajo…</div>;
  if (!services) return <div className="loading-screen">No se pudo iniciar la base local. Recarga la aplicación para intentarlo de nuevo.</div>;
  if (!user) return <LoginPage users={users} onLogin={login} error={loginError} busy={busy} />;

  const currentUser = { name: user.name, role: user.role === 'cashier' ? 'Vendedor' : user.role === 'supervisor' ? 'Supervisor' : 'Contabilidad', avatarColor: user.avatarColor };
  const previewClosed = Boolean(previewClosing && session?.id === previewClosing.session.id);
  const effectiveSession = previewClosed ? null : session;
  const historySessions = previewClosing ? [previewClosing.session] : [];
  const historyMovements = previewClosing?.movements ?? [];
  const showMobileNav = view !== 'open' && view !== 'new-movement' && view !== 'closing' && view !== 'closing-summary' && view !== 'movement-detail' && view !== 'history-detail';
  const navTo = (next: View) => setView(next);

  return <div className="app-shell"><div className="app-frame">
    <aside className="sidebar">
      <BrandLockup compact />
      <div className="sidebar-nav"><div className="nav-label">Espacio de trabajo</div><nav className="nav-list">
        <button className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => navTo('home')}><span className="nav-icon">⌂</span>Inicio</button>
        <button className={`nav-item ${view === 'movements' || view === 'new-movement' || view === 'movement-detail' ? 'active' : ''}`} onClick={() => navTo('movements')} disabled={!session}><span className="nav-icon">↗</span>Movimientos</button>
        <button className={`nav-item ${view === 'closing' || view === 'closing-summary' ? 'active' : ''}`} onClick={() => navTo('closing')} disabled={!session || previewClosed || !canOpen}><span className="nav-icon">◷</span>Cerrar caja</button>
        <button className={`nav-item ${view === 'history' || view === 'history-detail' ? 'active' : ''}`} onClick={() => navTo('history')}><span className="nav-icon">▤</span>Historial</button>
        {canViewAll && <button className={`nav-item ${view === 'all-sessions' ? 'active' : ''}`} onClick={() => navTo('all-sessions')}><span className="nav-icon">◫</span>Todas las cajas</button>}
        {canOpen && !session && <button className={`nav-item ${view === 'open' ? 'active' : ''}`} onClick={() => navTo('open')}><span className="nav-icon">＋</span>Abrir caja</button>}
      </nav></div>
      <div className="sidebar-bottom"><div className="connection-card"><div className="connection-title"><span className="connection-dot" />Datos en este dispositivo</div><p className="connection-note">La apertura E2 es real. Movimientos y cierre E3/E4 están en modo de vista previa hasta integrar el Backend.</p></div><button className="nav-item" onClick={logout}><span className="nav-icon">↗</span>Cerrar sesión</button></div>
    </aside>
    <main className="main-panel">
      <div className="preview-global"><span>FRONTEND E3 / E4 · PREVIEW</span><span>Movimientos y cierres simulados · E2 sigue conectado a la base local</span></div>
      {view === 'home' && <HomePage user={user} session={effectiveSession} register={register} onOpen={() => navTo('open')} onAllSessions={() => navTo('all-sessions')} onLogout={logout} onMovements={() => navTo('movements')} onClose={() => navTo('closing')} canViewAll={canViewAll} canOpen={canOpen} expectedBalanceMinor={summary.expectedBalanceMinor} movementCount={movements.length} previewClosedSession={previewClosed ? previewClosing?.session : null} />}
      {view === 'open' && canOpen && !session && <OpenSessionPage user={user} register={register} onBack={() => navTo('home')} onOpened={() => navTo('home')} openSession={openSession} />}
      {view === 'all-sessions' && canViewAll && <AllSessionsPage services={services} user={user} onBack={() => navTo('home')} />}
      {view === 'movements' && session && <MovementsPage user={currentUser} role={user.role} session={session} movements={movements} incomeMinor={summary.incomeMinor} expenseMinor={summary.expenseMinor} expectedMinor={summary.expectedBalanceMinor} onAdd={() => navTo('new-movement')} onSelect={(movement) => { setSelectedMovement(movement); navTo('movement-detail'); }} readOnly={previewClosed || user.role === 'accountant'} preview />}
      {view === 'new-movement' && session && !previewClosed && canOpen && <NewMovementPage user={currentUser} role={user.role} sessionOpenedAt={session.openedAt} onBack={() => navTo('movements')} onCreate={createMovement} />}
      {view === 'movement-detail' && selectedMovement && <MovementDetailPage movement={selectedMovement} user={user} onBack={() => navTo('movements')} />}
      {view === 'closing' && session && !previewClosed && canOpen && <ClosingPage user={user} session={session} movements={movements} onCancel={() => navTo('home')} onConfirm={completePreviewClosing} />}
      {view === 'closing-summary' && previewClosing && <ClosingSummaryPage closing={previewClosing} user={user} onHome={() => navTo('home')} onHistory={() => navTo('history')} />}
      {view === 'history' && <SessionHistoryPage user={user} sessions={historySessions} onBack={() => navTo('home')} onSelect={(selected) => { setSelectedHistorySession(selected); navTo('history-detail'); }} />}
      {view === 'history-detail' && selectedHistorySession && <SessionDetailPage user={user} session={selectedHistorySession} movements={historyMovements} onBack={() => navTo('history')} onMovement={(movement) => { setSelectedMovement(movement); navTo('movement-detail'); }} />}
      {view === 'open' && !canOpen && <Card><p>Tu perfil no puede abrir una caja.</p></Card>}
    </main>
  </div>
  {showMobileNav && <nav className="mobile-bottom-nav" aria-label="Navegación principal">
    <button className={view === 'home' ? 'active' : ''} onClick={() => navTo('home')}><span>⌂</span><small>Inicio</small></button>
    <button className={view === 'movements' || view === 'movement-detail' ? 'active' : ''} disabled={!session} onClick={() => navTo('movements')}><span>↗</span><small>Movimientos</small></button>
    <button className={view === 'closing' || view === 'closing-summary' ? 'active' : ''} disabled={!session || previewClosed || !canOpen} onClick={() => navTo('closing')}><span>◷</span><small>Cierre</small></button>
    <button className={view === 'history' || view === 'history-detail' ? 'active' : ''} onClick={() => navTo('history')}><span>▤</span><small>Historial</small></button>
  </nav>}
  </div>;
}