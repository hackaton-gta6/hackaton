import { useMemo, useState } from 'react';
import { DENOMINATIONS, formatAmount, parseAmount } from '@caja/domain';

type Props = { directAmount: string; onDirectAmount: (value: string) => void; counts: Record<string, number>; onCounts: (value: Record<string, number>) => void };

export function CashCounter({ directAmount, onDirectAmount, counts, onCounts }: Props) {
  const [mode, setMode] = useState<'total' | 'denominations'>('total');
  const totalMinor = useMemo(() => DENOMINATIONS.reduce((sum, denomination) => sum + denomination * (counts[String(denomination)] ?? 0), 0), [counts]);
  const directParsed = parseAmount(directAmount);
  const displayTotal = Object.values(counts).some((count) => count > 0) ? totalMinor : directParsed.ok ? directParsed.value : 0;
  return <section className="cash-counter">
    <div className="counter-mode-switch" role="group" aria-label="Modo de conteo">
      <button type="button" className={mode === 'total' ? 'active' : ''} onClick={() => setMode('total')}>Total directo</button>
      <button type="button" className={mode === 'denominations' ? 'active' : ''} onClick={() => setMode('denominations')}>Por billetes</button>
    </div>
    {mode === 'total' ? <div className="counter-total-field"><label className="field-label" htmlFor="counted-total">Efectivo contado</label><div className="money-input-wrap"><span>CUP</span><input id="counted-total" className="field money-input" inputMode="decimal" placeholder="0,00" value={directAmount} onChange={(event) => onDirectAmount(event.target.value)} /></div><p className="field-hint">Introduce el total que has contado físicamente.</p></div> : <div className="denomination-list">
      <div className="denomination-note">Valores cargados desde la configuración de prueba del dominio. Backend debe confirmar las denominaciones vigentes antes del cierre de E4.</div>
      {DENOMINATIONS.map((denomination) => {
        const count = counts[String(denomination)] ?? 0;
        return <div className="denomination-row" key={denomination}><div><strong>{formatAmount(denomination)}</strong><small>CUP por billete</small></div><div className="denomination-controls"><button type="button" aria-label={`Restar billete de ${formatAmount(denomination)}`} disabled={count === 0} onClick={() => onCounts({ ...counts, [String(denomination)]: Math.max(0, count - 1) })}>−</button><span>{count}</span><button type="button" aria-label={`Añadir billete de ${formatAmount(denomination)}`} onClick={() => onCounts({ ...counts, [String(denomination)]: count + 1 })}>＋</button></div></div>;
      })}
      <div className="denomination-total"><span>Total contado</span><strong>{formatAmount(displayTotal)} CUP</strong></div>
    </div>}
    <div className="counter-mode-footnote">El total directo se conserva al cambiar de modo. Al ajustar los billetes, el total se recalcula automáticamente.</div>
  </section>;
}