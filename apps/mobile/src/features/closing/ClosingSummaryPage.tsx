import { formatAmount, type Movement, type User } from '@caja/domain';
import { movementTypeLabels } from '../../i18n/movement-types';
import { AppButton } from '../../ui/components/AppButton';
import { AppHeader } from '../../ui/components/AppHeader';
import { Card } from '../../ui/components/Card';
import { SyncBadge } from '../../ui/components/SyncBadge';
import { BrandMark } from '../../ui/components/BrandMark';
import type { ClosingPreview } from './closing-preview';

type Props = { closing: ClosingPreview; user: User; onHome: () => void; onHistory: () => void };

function reportText(closing: ClosingPreview, user: User) {
  const lines = [
    'CONTROL DE CAJA · RESUMEN DE CIERRE',
    `Responsable: ${user.name}`,
    `Fecha: ${new Intl.DateTimeFormat('es-CU', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(closing.closedAt))}`,
    `Saldo esperado: ${formatAmount(closing.expectedBalanceMinor)} CUP`,
    `Efectivo contado: ${formatAmount(closing.countedBalanceMinor)} CUP`,
    `Diferencia: ${formatAmount(Math.abs(closing.varianceMinor))} CUP`,
    `Resultado: ${closing.varianceKind === 'balanced' ? 'Caja cuadrada' : closing.varianceKind === 'shortage' ? 'Faltante' : 'Sobrante'}`,
    `Nota: ${closing.varianceNote ?? 'Sin diferencia'}`,
  ];
  return lines.join('\n');
}

export function ClosingSummaryPage({ closing, user, onHome, onHistory }: Props) {
  const share = async () => {
    const text = reportText(closing, user);
    if (navigator.share) await navigator.share({ title: 'Cierre de caja', text });
    else if (navigator.clipboard) await navigator.clipboard.writeText(text);
  };
  const resultLabel = closing.varianceKind === 'balanced' ? 'Caja cuadrada' : closing.varianceKind === 'shortage' ? 'Faltante' : 'Sobrante';
  const date = new Intl.DateTimeFormat('es-CU', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Havana' }).format(new Date(closing.closedAt));
  return <div>
    <AppHeader eyebrow="E4 · Cierre completado" title="Resumen de cierre" />
    <div className="receipt-layout">
      <Card>
        <div className="receipt-top"><div className="receipt-brand"><BrandMark size={32} tone="cream" /><span>CONTROL DE CAJA</span></div><span className={`receipt-status ${closing.varianceKind}`}>{resultLabel}</span></div>
        <div className="receipt-total"><small>Efectivo contado</small><strong>{formatAmount(closing.countedBalanceMinor)} <small>CUP</small></strong><span>{date}</span></div>
        <div className="receipt-line" />
        <div className="receipt-row"><span>Saldo inicial</span><strong>{formatAmount(closing.session.openingBalanceMinor)} CUP</strong></div>
        {closing.movements.filter((movement: Movement) => movement.direction === 'in').map((movement) => <div className="receipt-row" key={movement.id}><span>+ {movementTypeLabels[movement.type as keyof typeof movementTypeLabels] ?? 'Ingreso'}</span><strong>{formatAmount(movement.amountMinor)}</strong></div>)}
        {closing.movements.filter((movement: Movement) => movement.direction === 'out').map((movement) => <div className="receipt-row" key={movement.id}><span>− {movementTypeLabels[movement.type as keyof typeof movementTypeLabels] ?? 'Egreso'}</span><strong>{formatAmount(movement.amountMinor)}</strong></div>)}
        <div className="receipt-line" />
        <div className="receipt-row"><span>Saldo esperado</span><strong>{formatAmount(closing.expectedBalanceMinor)} CUP</strong></div>
        <div className="receipt-row"><span>Efectivo contado</span><strong>{formatAmount(closing.countedBalanceMinor)} CUP</strong></div>
        <div className={`receipt-row receipt-variance ${closing.varianceKind}`}><span>Diferencia</span><strong>{closing.varianceMinor < 0 ? '−' : closing.varianceMinor > 0 ? '+' : ''}{formatAmount(Math.abs(closing.varianceMinor))} CUP</strong></div>
        <div className="receipt-line" />
        <div className="receipt-row"><span>Responsable</span><strong>{user.name}</strong></div>
        <div className="receipt-row"><span>Nota</span><strong>{closing.varianceNote ?? 'Sin diferencia'}</strong></div>
        <div className="receipt-foot">REGISTRO LOCAL · CONSERVA ESTE RESUMEN</div>
      </Card>
      <div className="stack">
        <Card paper><div className="card-kicker">Sesión finalizada</div><h2 className="section-title" style={{ fontSize: 20, margin: '8px 0' }}>La caja está cerrada</h2><p className="section-subtitle" style={{ lineHeight: 1.65 }}>El resumen queda disponible en el historial de esta vista previa. La escritura definitiva llegará con el repositorio de cierre del Backend.</p><SyncBadge status="local" /><div className="form-stack" style={{ marginTop: 18 }}><AppButton block onClick={share}>Compartir resumen ↗</AppButton><AppButton variant="secondary" block onClick={onHistory}>Ver historial</AppButton><AppButton variant="quiet" block onClick={onHome}>Volver al inicio</AppButton></div></Card>
        <div className="preview-note"><span>VISTA DE DESARROLLO</span> Este cierre es una simulación de interfaz. No modifica la sesión almacenada en Dexie.</div>
      </div>
    </div>
  </div>;
}