// Maps data statuses to the text and colour the UI shows, so every screen labels them the same way.
import type { BadgeTone } from '@/components/ui/Badge';
import type { DocumentStatus, TaskStatus } from '@/data/types';

export const DOCUMENT_STATUS: Record<DocumentStatus, { label: string; tone: BadgeTone }> = {
  missing: { label: 'Missing', tone: 'danger' },
  submitted: { label: 'Submitted', tone: 'warning' },
  verified: { label: 'Verified', tone: 'success' },
};

export const TASK_STATUS: Record<TaskStatus, { label: string; tone: BadgeTone }> = {
  pending: { label: 'Pending', tone: 'neutral' },
  in_progress: { label: 'In progress', tone: 'info' },
  done: { label: 'Done', tone: 'success' },
};
