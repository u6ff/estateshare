// Pure functions (no React): they can be checked on their own, without any screen.
import type { Entry } from '@/data/types';

export function totalAssets(entries: Entry[], estateId: string): number {
  return entries
    .filter((e) => e.estateId === estateId && e.kind === 'asset')
    .reduce((sum, e) => sum + e.value, 0);
}

export function totalDebts(entries: Entry[], estateId: string): number {
  return entries
    .filter((e) => e.estateId === estateId && e.kind === 'debt')
    .reduce((sum, e) => sum + e.value, 0);
}

// FR5: net estate = total assets - total debts.
export function netEstate(entries: Entry[], estateId: string): number {
  return totalAssets(entries, estateId) - totalDebts(entries, estateId);
}
