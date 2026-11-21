import { BrandMark } from './BrandMark';

type Props = { tone?: 'cream' | 'ink'; compact?: boolean };

export function BrandLockup({ tone = 'ink', compact = false }: Props) {
  return (
    <div className={`brand brand-lockup brand-lockup-${tone} ${compact ? 'brand-lockup-compact' : ''}`}>
      <BrandMark size={compact ? 36 : 42} tone={tone === 'ink' ? 'cream' : 'ink'} />
      <div>
        <div className="brand-name">Control de Caja</div>
        <div className="brand-sub">{compact ? 'Operaciones' : 'Operaciones con claridad'}</div>
      </div>
    </div>
  );
}