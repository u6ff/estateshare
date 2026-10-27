// Placeholder data for the Phase 1 prototype (no backend yet).
// Entries and tasks belong to Member B's features; Member A's screens only read them.
import type { Entry, Estate, EstateDocument, Heir, Task } from './types';

export const SAMPLE_ESTATES: Estate[] = [
  { id: 'e1', deceasedName: 'Ahmad Rahman', deathDate: '2025-03-14' },
  { id: 'e2', deceasedName: 'Fatma Hassan', deathDate: '2024-11-02' },
];

export const SAMPLE_HEIRS: Heir[] = [
  { id: 'h1', estateId: 'e1', name: 'Omar Ahmad', relationship: 'Son' },
  { id: 'h2', estateId: 'e1', name: 'Mona Ahmad', relationship: 'Daughter' },
  { id: 'h3', estateId: 'e1', name: 'Salma Youssef', relationship: 'Wife' },
  { id: 'h4', estateId: 'e2', name: 'Karim Hassan', relationship: 'Son' },
  { id: 'h5', estateId: 'e2', name: 'Nour Hassan', relationship: 'Daughter' },
];

export const SAMPLE_ENTRIES: Entry[] = [
  { id: 'a1', estateId: 'e1', kind: 'asset', name: 'Apartment in Nasr City', value: 2400000, category: 'Property', location: 'Nasr City, Cairo' },
  { id: 'a2', estateId: 'e1', kind: 'asset', name: 'Gold jewellery', value: 350000, category: 'Gold and valuables', location: 'Family safe' },
  { id: 'a3', estateId: 'e1', kind: 'asset', name: 'Savings account', value: 180000, category: 'Cash and savings', location: 'National Bank of Egypt' },
  { id: 'd1', estateId: 'e1', kind: 'debt', name: 'Bank loan', value: 300000, category: 'Loan', location: 'Banque Misr' },
  { id: 'd2', estateId: 'e1', kind: 'debt', name: 'Hospital bill', value: 50000, category: 'Bill', location: 'Dar El Fouad Hospital' },
  { id: 'a4', estateId: 'e2', kind: 'asset', name: 'Family car', value: 620000, category: 'Vehicles', location: 'Giza' },
  { id: 'd3', estateId: 'e2', kind: 'debt', name: 'Credit card balance', value: 20000, category: 'Bill', location: 'CIB' },
];

export const SAMPLE_DOCUMENTS: EstateDocument[] = [
  { id: 'doc1', estateId: 'e1', title: 'Death certificate', status: 'verified' },
  { id: 'doc2', estateId: 'e1', title: 'Inheritance declaration (Elam Wirasa)', status: 'submitted' },
  { id: 'doc3', estateId: 'e1', title: 'Apartment ownership contract', status: 'missing' },
  { id: 'doc4', estateId: 'e2', title: 'Death certificate', status: 'submitted' },
];

export const SAMPLE_TASKS: Task[] = [
  { id: 't1', estateId: 'e1', title: 'Collect bank statements', deadline: '2025-05-01', status: 'done' },
  { id: 't2', estateId: 'e1', title: 'Value the apartment', deadline: '2025-06-15', status: 'in_progress' },
  { id: 't3', estateId: 'e1', title: 'Pay off the bank loan', deadline: '2025-07-01', status: 'pending' },
  { id: 't4', estateId: 'e2', title: 'Transfer car ownership', deadline: '2025-02-10', status: 'pending' },
];
