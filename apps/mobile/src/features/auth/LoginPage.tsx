import { useState } from 'react';
import type { User } from '@caja/domain';
import { roleLabel } from '../../i18n/es';
import { AppButton } from '../../ui/components/AppButton';
import { PinPad } from '../../ui/components/PinPad';
import { UserAvatar } from '../../ui/components/UserAvatar';

type Props = { users: User[]; onLogin: (userId: string, pin: string) => Promise<void>; error?: string; busy?: boolean };

export function LoginPage({ users, onLogin, error = '', busy = false }: Props) {
  const [selectedId, setSelectedId] = useState(users[0]?.id ?? '');
  const [pin, setPin] = useState('');
  const selected = users.find((user) => user.id === selectedId);
  const submit = async () => {
    if (selectedId && pin.length === 4) await onLogin(selectedId, pin);
  };
  return <main className="auth-layout">
    <section className="auth-visual">
      <div className="auth-brand"><div className="brand"><div className="brand-mark">CC</div><div><div className="brand-name" style={{ color: 'var(--cream)' }}>Control de Caja</div><div className="brand-sub" style={{ color: 'rgba(243,238,227,.48)' }}>Operaciones con claridad</div></div></div></div>
      <div className="auth-message"><div className="auth-kicker">Gestión de efectivo · Offline first</div><h1>Tu operación,<br />bajo control.</h1><p>Una visión clara de cada caja, cada apertura y cada movimiento. Incluso cuando la conexión no acompaña.</p></div>
      <div className="auth-footer">PLATAFORMA DE CONTROL OPERATIVO · DEMO</div>
    </section>
    <section className="auth-form-wrap">
      <div className="auth-form">
        <div className="eyebrow">Bienvenido de nuevo</div><h2>Accede a tu caja</h2><p>Selecciona tu perfil e introduce tu PIN para continuar.</p>
        <div className="field-label">1. Selecciona tu perfil</div>
        <div className="user-select-list">
          {users.map((user) => <button type="button" key={user.id} className={`user-option ${selectedId === user.id ? 'selected' : ''}`} onClick={() => { setSelectedId(user.id); setPin(''); }}>
            <UserAvatar name={user.name} color={user.avatarColor} /><span><span className="user-option-name">{user.name}</span><span className="user-option-role" style={{ display: 'block' }}>{roleLabel(user.role)}</span></span><span style={{ marginLeft: 'auto', color: selectedId === user.id ? 'var(--orange)' : 'transparent', fontWeight: 900 }}>●</span>
          </button>)}
        </div>
        <div className="field-label" style={{ textAlign: 'center', marginTop: 20 }}>2. Introduce tu PIN de 4 dígitos</div>
        <div className="pin-dots">{[0,1,2,3].map((index) => <span key={index} className={`pin-dot ${pin.length > index ? 'filled' : ''}`} />)}</div>
        <PinPad value={pin} onChange={setPin} disabled={busy} />
        <div className="auth-error" role="alert">{error}</div>
        <AppButton block disabled={!selected || pin.length !== 4 || busy} onClick={submit}>{busy ? 'Verificando…' : 'Entrar a mi espacio'} <span>↗</span></AppButton>
        <p style={{ textAlign: 'center', fontSize: 10, marginTop: 18 }}>Entorno de demostración · Los datos se guardan en este dispositivo.</p>
      </div>
    </section>
  </main>;
}