import { formatAmount, formatSignedAmount } from '@caja/domain';

type Props = { amountMinor: number; signed?: boolean; tone?: 'default' | 'income' | 'expense' };

export function AmountText({ amountMinor, signed = false, tone = 'default' }: Props) {
  const color = tone === 'income' ? 'var(--green)' : tone === 'expense' ? 'var(--red)' : 'var(--ink)';
  return <span className="amount-big" style={{ color }}>{signed ? formatSignedAmount(amountMinor) : formatAmount(amountMinor)}</span>;
}