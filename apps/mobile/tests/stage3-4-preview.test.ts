import { describe, expect, it } from 'vitest';
import { MOVEMENT_TYPES, buildMovement, buildSession } from '@caja/domain';
import { movementTypeLabels } from '../src/i18n/movement-types';
import { summarizePreview, varianceKind } from '../src/features/closing/closing-preview';

describe('E3/E4 frontend preview contracts', () => {
  it('covers every movement type exported by the domain', () => {
    expect(Object.keys(movementTypeLabels).sort()).toEqual([...MOVEMENT_TYPES].sort());
  });

  it('calculates the visible preview balance from opening cash plus local movements', () => {
    const session = buildSession({ openingBalanceMinor: 50000 });
    const movements = [
      buildMovement({ id: 'movement-in', direction: 'in', amountMinor: 10000 }),
      buildMovement({ id: 'movement-out', direction: 'out', amountMinor: 2500 }),
    ];
    expect(summarizePreview(session, movements)).toEqual({
      incomeMinor: 10000,
      expenseMinor: 2500,
      expectedBalanceMinor: 57500,
    });
  });

  it('classifies balanced, shortage and surplus previews', () => {
    expect(varianceKind(0)).toBe('balanced');
    expect(varianceKind(-1)).toBe('shortage');
    expect(varianceKind(1)).toBe('surplus');
  });
});