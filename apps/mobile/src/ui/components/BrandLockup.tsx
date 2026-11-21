type Props = { tone?: 'cream' | 'ink'; compact?: boolean };

/** Text-first wordmark. The previous C/c emblem is intentionally retired. */
export function BrandLockup({ tone = 'ink', compact = false }: Props) {
  return (
    <div className={`brand brand-lockup brand-lockup-${tone} ${compact ? 'brand-lockup-compact' : ''}`}>
      <div className="brand-wordmark">
        <div className="brand-name">Control de Caja</div>
        <div className="brand-sub">{compact ? 'Operaciones' : 'Operaciones con claridad'}</div>
      </div>
    </div>
  );
}
