// Lab concept: pure function — no React, same input always gives the same output.
import { Heir } from '@/src/data/types';

export type Share = {
  heirId: string;
  name: string;
  fraction: string;
  percentage: number;
  amount: number;
};

export const ASSUMPTIONS =
  'Placeholder rule: the net estate is split into equal shares among all listed heirs, ' +
  'regardless of relationship. This is not legal advice and will be replaced by real inheritance rules.';

export function calculateShares(heirs: Heir[], netEstate: number): Share[] {
  if (heirs.length === 0) return [];

  const count = heirs.length;
  return heirs.map((heir) => ({
    heirId: heir.id,
    name: heir.name,
    fraction: `1/${count}`,
    percentage: 100 / count,
    amount: netEstate / count,
  }));
}
