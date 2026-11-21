import type { CashSession, Movement } from '@caja/domain';

export type VarianceKind = 'balanced' | 'shortage' | 'surplus';
export type ClosingPreview = {
  session: CashSession;
  movements: Movement[];
  expectedBalanceMinor: number;
  countedBalanceMinor: number;
  varianceMinor: number;
  varianceKind: VarianceKind;
  varianceNote: string | null;
  denominationBreakdown: Record<string, number> | null;
  closedAt: string;
  closedByUserId: string;
};

export function summarizePreview(session: CashSession, movements: Movement[]) {
  const incomeMinor = movements.filter((movement) => movement.direction === 'in').reduce((sum, movement) => sum + movement.amountMinor, 0);
  const expenseMinor = movements.filter((movement) => movement.direction === 'out').reduce((sum, movement) => sum + movement.amountMinor, 0);
  return { incomeMinor, expenseMinor, expectedBalanceMinor: session.openingBalanceMinor + incomeMinor - expenseMinor };
}

export function varianceKind(varianceMinor: number): VarianceKind {
  return varianceMinor === 0 ? 'balanced' : varianceMinor < 0 ? 'shortage' : 'surplus';
}