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
    if (!parsed.ok) {
      setError(es.errors[parsed.errors[0].code as keyof typeof es.errors] ?? 'Revisa el importe introducido.');
      return;
    }
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

  return <div className="task-page">
    <AppHeader title="Abrir caja" action={<AppButton variant="quiet" onClick={onBack}>Cancelar</AppButton>} />
    <Card className="task-card">
      <div className="task-register">
        <span>Caja</span>
        <strong>{register?.name ?? 'Sin caja asignada'}</strong>
      </div>
      <AmountInput value={amount} onChange={setAmount} error={error} />
      <p className="task-hint">Efectivo disponible al comenzar. Si no hay efectivo, introduce 0.</p>
      <AppButton block onClick={submit} disabled={!register}>Confirmar apertura</AppButton>
    </Card>
    {showConfirm && <ConfirmDialog title="Abrir caja" description={`Se abrirá ${register?.name ?? 'la caja asignada'} con un saldo inicial de ${amount} CUP.`} confirmLabel="Abrir caja" onConfirm={confirm} onCancel={() => setShowConfirm(false)} busy={busy} />}
  </div>;
}
