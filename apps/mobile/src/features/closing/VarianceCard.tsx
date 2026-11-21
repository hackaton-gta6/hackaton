import { formatAmount } from '@caja/domain';
import type { VarianceKind } from './closing-preview';

type Props = { expectedMinor: number; countedMinor: number; varianceMinor: number; kind: VarianceKind };

export function VarianceCard({ expectedMinor, countedMinor, varianceMinor, kind }: Props) {
  const label = kind === 'balanced' ? 'Caja cuadrada' : kind === 'shortage' ? 'Faltante' : 'Sobrante';
  return <section className={`variance-card variance-${kind}`}>
    <div className="variance-heading"><span>Resultado del conteo</span><strong>{label}</strong></div>
    <div className="variance-main"><small>Diferencia</small><strong>{varianceMinor === 0 ? '0,00' : `${varianceMinor < 0 ? '−' : '+'}${formatAmount(Math.abs(varianceMinor))}`} <small>CUP</small></strong></div>
    <div className="variance-pair"><div><small>Saldo esperado</small><strong>{formatAmount(expectedMinor)}</strong></div><div><small>Efectivo contado</small><strong>{formatAmount(countedMinor)}</strong></div></div>
  </section>;
}