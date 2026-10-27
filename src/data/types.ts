// Data model for EstateShare (see the ERD in the Phase 1 report).
// Net estate and shares are calculated from these, never stored.

export type Estate = {
  id: string;
  deceasedName: string;
  deathDate: string; // YYYY-MM-DD
};

export type Heir = {
  id: string;
  estateId: string;
  name: string;
  relationship: string;
};

export type EntryKind = 'asset' | 'debt';

export type Entry = {
  id: string;
  estateId: string;
  kind: EntryKind;
  name: string;
  value: number; // EGP
  category: string;
  location: string;
  photoUri?: string;
};

export type DocumentStatus = 'missing' | 'submitted' | 'verified';

export type EstateDocument = {
  id: string;
  estateId: string;
  title: string;
  status: DocumentStatus;
};

export type TaskStatus = 'pending' | 'in_progress' | 'done';

export type Task = {
  id: string;
  estateId: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
};
