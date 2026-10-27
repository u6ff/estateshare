// FR5: proposed share per heir. A pure function, so it can be tested without the UI.
import type { Heir } from '@/data/types';

export type HeirShare = {
  heirId: string;
  name: string;
  relationship: string;
  fraction: string; // e.g. "1/3"
  percentage: number; // e.g. 33.3
  amount: number; // EGP
};

export const ASSUMPTIONS = [
  'The net estate is total assets minus total debts.',
  'For this prototype, the net estate is divided equally between all registered heirs.',
  'Later phases will replace equal division with one clearly defined inheritance framework.',
  'These figures are a proposal for the family to discuss, not a legal ruling.',
];

export function calculateShares(heirs: Heir[], netEstate: number): HeirShare[] {
  if (heirs.length === 0) return [];
  const count = heirs.length;
  const amount = Math.max(netEstate, 0) / count;
  return heirs.map((heir) => ({
    heirId: heir.id,
    name: heir.name,
    relationship: heir.relationship,
    fraction: `1/${count}`,
    percentage: Math.round((1000 / count)) / 10,
    amount,
  }));
}
