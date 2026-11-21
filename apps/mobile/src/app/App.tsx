import { useEffect, useState } from 'react';
import type { CashSession, Register, User } from '@caja/domain';
import { createServices } from '../data';
import type { Services as DataServices } from '../data/create-services';
import { es } from '../i18n/es';
import { LoginPage } from '../features/auth/LoginPage';
import { AllSessionsPage } from '../features/cash-session/AllSessionsPage';
import { HomePage } from '../features/cash-session/HomePage';
import { OpenSessionPage } from '../features/cash-session/OpenSessionPage';

export type Services = DataServices;
type View = 'home' | 'open' | 'all-sessions';

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
      const code = result.errors[0].code as keyof typeof es.errors;
      setLoginError(es.errors[code] ?? 'No se pudo validar el acceso.');
      return;
    }
    setUser(result.value);
    setView('home');
  };

  const logout = async () => {
    if (services) await services.settings.set('activeUserId', '');
    setUser(null);
    setSession(null);
    setView('home');
  };

  if (loading) return <div className="loading-screen">Preparando tu espacio de trabajo…</div>;
  if (!services) return <div className="loading-screen">No se pudo iniciar la base local. Recarga la aplicación para intentarlo de nuevo.</div>;
  if (!user) return <LoginPage users={users} onLogin={login} error={loginError} busy={busy} />;

  const canViewAll = user.role === 'supervisor' || user.role === 'accountant';
  const openSession = async (openingUser: User, amountMinor: number) => {
    const result = await services.sessions.openSession(openingUser, amountMinor);
    if (result.ok) setSession(result.value);
    return result;
  };

  return <div className="app-shell"><div className="app-frame">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">CC</div><div><div className="brand-name">Control de Caja</div><div className="brand-sub">Operaciones</div></div></div>
      <div className="sidebar-nav"><div className="nav-label">Espacio de trabajo</div><nav className="nav-list">
        <button className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}><span className="nav-icon">⌂</span>Inicio</button>
        <button className={`nav-item ${view === 'open' ? 'active' : ''}`} onClick={() => setView('open')} disabled={user.role === 'accountant' || Boolean(session)}><span className="nav-icon">＋</span>Abrir caja</button>
        {canViewAll && <button className={`nav-item ${view === 'all-sessions' ? 'active' : ''}`} onClick={() => setView('all-sessions')}><span className="nav-icon">▤</span>Todas las cajas</button>}
      </nav></div>
      <div className="sidebar-bottom"><div className="connection-card"><div className="connection-title"><span className="connection-dot" />Datos en este dispositivo</div><p className="connection-note">Modo local activo. La sincronización con el ERP simulado llegará en su etapa correspondiente.</p></div><button className="nav-item" onClick={logout}><span className="nav-icon">↗</span>Cerrar sesión</button></div>
    </aside>
    <main className="main-panel">
      {view === 'home' && <HomePage user={user} session={session} register={register} onOpen={() => setView('open')} onAllSessions={() => setView('all-sessions')} onLogout={logout} canViewAll={canViewAll} />}
      {view === 'open' && <OpenSessionPage user={user} register={register} onBack={() => setView('home')} onOpened={() => setView('home')} openSession={openSession} />}
      {view === 'all-sessions' && canViewAll && <AllSessionsPage services={services} user={user} onBack={() => setView('home')} />}
    </main>
  </div></div>;
}