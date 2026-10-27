// Lab concept: TypeScript types shared across screens and Context.

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
