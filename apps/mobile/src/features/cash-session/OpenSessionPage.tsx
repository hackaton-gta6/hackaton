import { useEffect, useState } from 'react';
import type { Register, User } from '@caja/domain';
import { parseAmount } from '@caja/domain';
import { es } from '../../i18n/es';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { AmountInput } from '../../ui/components/AmountInput';
import { Card } from '../../ui/components/Card';
import { ConfirmDialog } from '../../ui/components/ConfirmDialog';

type Props = { user: User; register: Register | null; onBack: () => void; onOpened: () => void; openSession: (user: User, amountMinor: number) => Promise<{ ok: boolean; errors?: { code: string }[] }> };

export function OpenSessionPage({ user, register, onBack, onOpened, openSession }: Props) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setError(''); }, [amount]);
  const submit = () => {
    const parsed = parseAmount(amount);
    if (!parsed.ok) { setError(es.errors[parsed.errors[0].code as keyof typeof es.errors] ?? 'Revisa el importe introducido.'); return; }
    setError('');
    setShowConfirm(true);
  };
  const confirm = async () => {
    const parsed = parseAmount(amount);
    if (!parsed.ok) return;
    setBusy(true);
    const result = await openSession(user, parsed.value);
    setBusy(false);
    if (!result.ok) {
      setShowConfirm(false);
      setError(es.errors[result.errors[0].code as keyof typeof es.errors] ?? 'No se pudo abrir la caja.');
      return;
    }
    setShowConfirm(false);
    onOpened();
  };
  return <div>
    <AppHeader eyebrow="Apertura de caja · E2" title="Nueva apertura" user={{ name: user.name, role: user.role === 'cashier' ? 'Vendedor' : 'Supervisor', avatarColor: user.avatarColor }} action={<AppButton variant="quiet" onClick={onBack}>← Volver</AppButton>} />
    <div className="content-grid">
      <Card>
        <div className="card-kicker">Paso 01 · Datos de apertura</div><h2 className="section-title" style={{ fontSize: 21, margin: '9px 0 7px' }}>Registra el saldo inicial</h2><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6, margin: '0 0 24px' }}>Indica cuánto efectivo hay en la caja al comenzar la jornada. Puedes iniciar con saldo cero.</p>
        <div className="form-stack">
          <div><label className="field-label">Caja asignada</label><div className="field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800 }}>{register?.name ?? 'Sin caja asignada'}<span style={{ color: 'var(--green)', fontSize: 10 }}>● Asignada</span></div><div className="field-hint">La caja viene definida por tu perfil y no puede cambiarse aquí.</div></div>
          <AmountInput value={amount} onChange={setAmount} error={error} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><AppButton variant="secondary" onClick={onBack}>Cancelar</AppButton><AppButton onClick={submit} disabled={!amount.trim() || !register}>Revisar apertura ↗</AppButton></div>
        </div>
      </Card>
      <div className="stack">
        <Card paper><div className="card-kicker">Antes de confirmar</div><h3 className="section-title" style={{ margin: '9px 0 14px' }}>Un registro importante</h3><div className="info-row"><span className="info-label">Responsable</span><span className="info-value">{user.name}</span></div><div className="info-row"><span className="info-label">Moneda</span><span className="info-value">CUP</span></div><div className="info-row"><span className="info-label">Persistencia</span><span className="info-value">En este dispositivo</span></div></Card>
        <Card><div style={{ fontSize: 20, marginBottom: 10 }}>◷</div><div className="section-title">Una sola caja abierta</div><p style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.6, marginBottom: 0 }}>El sistema evita que un mismo usuario abra dos sesiones al mismo tiempo.</p></Card>
      </div>
    </div>
    {showConfirm && <ConfirmDialog title="¿Confirmar apertura?" description={`Se abrirá ${register?.name ?? 'la caja asignada'} con un saldo inicial de ${amount} CUP. Esta operación quedará guardada en el dispositivo.`} confirmLabel="Abrir caja" onConfirm={confirm} onCancel={() => setShowConfirm(false)} busy={busy} />}
  </div>;
}