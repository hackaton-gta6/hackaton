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
    <section className="auth-form-wrap auth-form-wrap-full">
      <div className="auth-form">
        <h2>Acceder</h2>
        <div className="field-label">Perfil</div>
        <div className="user-select-list">
          {users.map((user) => <button type="button" key={user.id} className={`user-option ${selectedId === user.id ? 'selected' : ''}`} onClick={() => { setSelectedId(user.id); setPin(''); }}>
            <UserAvatar name={user.name} color={user.avatarColor} /><span><span className="user-option-name">{user.name}</span><span className="user-option-role" style={{ display: 'block' }}>{roleLabel(user.role)}</span></span><span style={{ marginLeft: 'auto', color: selectedId === user.id ? 'var(--ink)' : 'transparent', fontWeight: 600 }}>✓</span>
          </button>)}
        </div>
        <div className="field-label" style={{ textAlign: 'center', marginTop: 20 }}>PIN</div>
        <div className="pin-dots">{[0,1,2,3].map((index) => <span key={index} className={`pin-dot ${pin.length > index ? 'filled' : ''}`} />)}</div>
        <PinPad value={pin} onChange={setPin} disabled={busy} />
        <div className="auth-error" role="alert">{error}</div>
        <AppButton block disabled={!selected || pin.length !== 4 || busy} onClick={submit}>{busy ? 'Verificando…' : 'Entrar a mi espacio'} <span>↗</span></AppButton>
        
      </div>
    </section>
  </main>;
}