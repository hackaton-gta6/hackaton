import { formatAmount } from '@caja/domain';

type Props = { incomeMinor: number; expenseMinor: number; expectedMinor: number };

export function SessionSummaryCard({ incomeMinor, expenseMinor, expectedMinor }: Props) {
  return <section className="session-summary-card">
    <div className="summary-topline"><span>Resumen de caja</span><span className="summary-live-dot">ACTUALIZADO</span></div>
    <div className="summary-expected-label">Saldo esperado</div>
    <div className="summary-expected">{formatAmount(expectedMinor)} <small>CUP</small></div>
    <div className="summary-breakdown">
      <div><span className="summary-sign income">↗</span><span><small>Ingresos</small><strong>{formatAmount(incomeMinor)}</strong></span></div>
      <div><span className="summary-sign expense">↘</span><span><small>Egresos</small><strong>{formatAmount(expenseMinor)}</strong></span></div>
    </div>
  </section>;
}