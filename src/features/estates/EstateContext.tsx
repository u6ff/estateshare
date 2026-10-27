// Lab 02: shared state with React Context + a custom hook.
// The provider owns the data; every screen reads it through useEstates().
import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  SAMPLE_DOCUMENTS,
  SAMPLE_ENTRIES,
  SAMPLE_ESTATES,
  SAMPLE_HEIRS,
  SAMPLE_TASKS,
} from '@/data/sampleData';
import type { Entry, Estate, EstateDocument, Heir, Task } from '@/data/types';

type EstateValue = {
  estates: Estate[];
  heirs: Heir[];
  entries: Entry[];
  documents: EstateDocument[];
  tasks: Task[];
  addEstate: (deceasedName: string, deathDate: string) => string;
  addHeir: (estateId: string, name: string, relationship: string) => void;
};

const EstateContext = createContext<EstateValue | null>(null);

function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}`;
}

export function EstateProvider({ children }: { children: ReactNode }) {
  const [estates, setEstates] = useState<Estate[]>(SAMPLE_ESTATES);
  const [heirs, setHeirs] = useState<Heir[]>(SAMPLE_HEIRS);
  // Entries, documents and tasks are read-only here; Member B adds the functions that change them.
  const [entries] = useState<Entry[]>(SAMPLE_ENTRIES);
  const [documents] = useState<EstateDocument[]>(SAMPLE_DOCUMENTS);
  const [tasks] = useState<Task[]>(SAMPLE_TASKS);

  function addEstate(deceasedName: string, deathDate: string): string {
    const id = newId('e');
    // New array instead of push(), so React sees the change.
    setEstates((current) => [{ id, deceasedName, deathDate }, ...current]);
    return id;
  }

  function addHeir(estateId: string, name: string, relationship: string) {
    setHeirs((current) => [...current, { id: newId('h'), estateId, name, relationship }]);
  }

  return (
    <EstateContext.Provider value={{ estates, heirs, entries, documents, tasks, addEstate, addHeir }}>
      {children}
    </EstateContext.Provider>
  );
}

export function useEstates(): EstateValue {
  const value = useContext(EstateContext);
  if (!value) throw new Error('useEstates() must be used inside <EstateProvider>');
  return value;
}
