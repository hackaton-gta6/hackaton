import { useMemo, useState } from 'react';
import { parseAmount, type CashSession, type Movement, type User } from '@caja/domain';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { ConfirmDialog } from '../../ui/components/ConfirmDialog';
import { FormField } from '../../ui/components/FormField';
import { CashCounter } from './CashCounter';
import { VarianceCard } from './VarianceCard';
import { summarizePreview, varianceKind, type ClosingPreview } from './closing-preview';

type Props = { user: User; session: CashSession; movements: Movement[]; onCancel: () => void; onConfirm: (closing: ClosingPreview) => void };

export function ClosingPage({ user, session, movements, onCancel, onConfirm }: Props) {
  const summary = useMemo(() => summarizePreview(session, movements), [session, movements]);
  const [step, setStep] = useState(1);
  const [directAmount, setDirectAmount] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const parsed = parseAmount(directAmount);
  const countedMinor = step > 1 && directAmount.trim() && parsed.ok ? parsed.value : 0;
  const varianceMinor = countedMinor - summary.expectedBalanceMinor;
  const kind = varianceKind(varianceMinor);
  const hasDenominationCount = Object.values(counts).some((count) => count > 0);

  const confirm = () => {
    if (!directAmount.trim() || !parsed.ok) { setError('Introduce un total contado válido.'); setStep(1); setConfirmOpen(false); return; }
    const variance = parsed.value - summary.expectedBalanceMinor;
    if (variance !== 0 && note.trim().length < 3) { setError('Explica la diferencia con al menos 3 caracteres.'); setStep(2); setConfirmOpen(false); return; }
    const closedAt = new Date().toISOString();
    onConfirm({
      session: { ...session, status: 'closed', closedAt, countedBalanceMinor: parsed.value, expectedBalanceMinor: summary.expectedBalanceMinor, varianceMinor: variance, varianceNote: variance === 0 ? null : note.trim(), closedByUserId: user.id, denominationBreakdown: hasDenominationCount ? counts : null },
      movements, expectedBalanceMinor: summary.expectedBalanceMinor, countedBalanceMinor: parsed.value, varianceMinor: variance, varianceKind: varianceKind(variance), varianceNote: variance === 0 ? null : note.trim(), denominationBreakdown: hasDenominationCount ? counts : null, closedAt, closedByUserId: user.id,
    });
  };

  return <div>
    <AppHeader eyebrow="E4 · Fin de jornada" title="Cerrar caja" action={<AppButton variant="quiet" onClick={onCancel}>← Volver</AppButton>} />
    <div className="closing-wrap">
      <div className="step-track"><span className={step >= 1 ? 'current' : ''}>01 <small>Conteo</small></span><i /><span className={step >= 2 ? 'current' : ''}>02 <small>Revisión</small></span><i /><span className={step >= 3 ? 'current' : ''}>03 <small>Cierre</small></span></div>
      {step === 1 && <Card><div className="card-kicker">Paso 01 · Conteo físico</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 6px' }}>¿Cuánto efectivo hay?</h2><p className="section-subtitle">Cuenta el efectivo disponible en la caja. Puedes introducir el total o desglosarlo por billetes.</p><div className="expected-strip"><span>Saldo que debería haber</span><strong>{summary.expectedBalanceMinor.toLocaleString('es-CU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CUP</strong></div><CashCounter directAmount={directAmount} onDirectAmount={(value) => { setDirectAmount(value); setError(''); }} counts={counts} onCounts={(value) => { setCounts(value); const total = Object.entries(value).reduce((sum, [denomination, count]) => sum + Number(denomination) * count, 0); setDirectAmount((total / 100).toLocaleString('es-CU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })); setError(''); }} /><div className="form-error" role="alert">{error}</div><div className="form-actions"><AppButton variant="secondary" onClick={onCancel}>Cancelar</AppButton><AppButton onClick={() => { if (!directAmount.trim() || !parsed.ok) { setError('Introduce un total contado válido.'); return; } setError(''); setStep(2); }}>Revisar diferencia ↗</AppButton></div></Card>}
      {step === 2 && <Card><div className="card-kicker">Paso 02 · Revisión</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 18px' }}>Antes de cerrar</h2><VarianceCard expectedMinor={summary.expectedBalanceMinor} countedMinor={countedMinor} varianceMinor={varianceMinor} kind={kind} /><div className="closing-note-block">{kind === 'balanced' ? <p>El efectivo coincide con el saldo esperado. No necesitas añadir una nota.</p> : <FormField label="Explica la diferencia (obligatorio)" htmlFor="variance-note" hint="Mínimo 3 caracteres para dejar constancia."><textarea id="variance-note" className="field text-field" rows={3} placeholder="Describe brevemente el motivo…" value={note} onChange={(event) => setNote(event.target.value)} /></FormField>}</div><div className="form-error" role="alert">{error}</div><div className="form-actions"><AppButton variant="secondary" onClick={() => setStep(1)}>← Volver al conteo</AppButton><AppButton disabled={kind !== 'balanced' && note.trim().length < 3} onClick={() => { setError(''); setStep(3); }}>Continuar</AppButton></div></Card>}
      {step === 3 && <Card><div className="card-kicker">Paso 03 · Confirmación</div><h2 className="section-title" style={{ fontSize: 22, margin: '9px 0 8px' }}>El cierre está listo</h2><p className="section-subtitle">Comprueba el resultado antes de finalizar. Una caja cerrada no admite nuevos movimientos.</p><VarianceCard expectedMinor={summary.expectedBalanceMinor} countedMinor={countedMinor} varianceMinor={varianceMinor} kind={kind} /><div className="info-row"><span className="info-label">Responsable</span><strong className="info-value">{user.name}</strong></div><div className="info-row"><span className="info-label">Nota</span><strong className="info-value">{note.trim() || 'Sin diferencia'}</strong></div><div className="form-actions"><AppButton variant="secondary" onClick={() => setStep(2)}>← Revisar</AppButton><AppButton onClick={() => setConfirmOpen(true)}>Confirmar cierre</AppButton></div></Card>}
    </div>
    {confirmOpen && <ConfirmDialog title="¿Cerrar esta caja?" description="Esta vista simula el cierre para que puedas revisar la experiencia. Todavía no se escribirá en la base de datos real." confirmLabel="Cerrar caja" onConfirm={confirm} onCancel={() => setConfirmOpen(false)} />}
  </div>;
}