import { useEffect, useState } from 'react';

type Props = { value: string; onChange: (value: string) => void; error?: string; disabled?: boolean };

export function AmountInput({ value, onChange, error, disabled = false }: Props) {
  const [focused, setFocused] = useState(false);
  const [display, setDisplay] = useState(value);
  useEffect(() => { if (!focused) setDisplay(value); }, [value, focused]);
  const update = (raw: string) => {
    const cleaned = raw.replace(/[^0-9,.]/g, '');
    setDisplay(cleaned);
    onChange(cleaned);
  };
  return <div>
    <label className="field-label" htmlFor="opening-amount">Saldo inicial</label>
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: 16, top: 16, fontSize: 10, color: 'var(--muted)', fontWeight: 850, letterSpacing: '.08em' }}>CUP</span>
      <input id="opening-amount" className="field" style={{ paddingLeft: 53, fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }} type="text" inputMode="decimal" autoComplete="off" placeholder="0,00" value={display} disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={(event) => update(event.target.value)} aria-invalid={Boolean(error)} />
    </div>
    {error ? <div className="form-error">{error}</div> : <div className="field-hint">Usa coma para los decimales. Ejemplo: 1.250,50 CUP.</div>}
  </div>;
}