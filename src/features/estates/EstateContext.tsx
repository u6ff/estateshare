// Lab concept: React Context — one shared store of estates and heirs for every screen.
import { createContext, ReactNode, useContext, useState } from 'react';

import { Estate, Heir } from '@/src/data/types';

type EstateContextValue = {
  estates: Estate[];
  heirs: Heir[];
  addEstate: (deceasedName: string, deathDate: string) => string;
  addHeir: (estateId: string, name: string, relationship: string) => void;
};

const EstateContext = createContext<EstateContextValue | null>(null);

const SAMPLE_ESTATES: Estate[] = [
  { id: '1', deceasedName: 'Ahmad Rahman', deathDate: '2025-03-14' },
];

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
}

export function EstateProvider({ children }: { children: ReactNode }) {
  const [estates, setEstates] = useState<Estate[]>(SAMPLE_ESTATES);
  const [heirs, setHeirs] = useState<Heir[]>([]);

  function addEstate(deceasedName: string, deathDate: string) {
    const id = makeId();
    setEstates((prev) => [...prev, { id, deceasedName, deathDate }]);
    return id;
  }

  function addHeir(estateId: string, name: string, relationship: string) {
    setHeirs((prev) => [...prev, { id: makeId(), estateId, name, relationship }]);
  }

  return (
    <EstateContext.Provider value={{ estates, heirs, addEstate, addHeir }}>
      {children}
    </EstateContext.Provider>
  );
}

export function useEstates() {
  const ctx = useContext(EstateContext);
  if (!ctx) {
    throw new Error('useEstates must be used inside <EstateProvider>. Check app/_layout.tsx.');
  }
  return ctx;
}
