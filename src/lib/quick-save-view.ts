import { BookmarkDecisionStatus } from '../services/interfaces/IBookmarkModeHandler';

export const QuickSaveView = {
  SAVED: 'saved',
  OFF: 'off',
  CONFIRM: 'confirm',
  SAVE: 'save',
} as const;
export type QuickSaveView = typeof QuickSaveView[keyof typeof QuickSaveView];

export function getQuickSaveView(
  saved: boolean,
  status: BookmarkDecisionStatus,
  confirming: boolean,
): QuickSaveView {
  if (saved) return QuickSaveView.SAVED;
  if (status === BookmarkDecisionStatus.NOT_HANDLED) return QuickSaveView.OFF;
  if (confirming && status === BookmarkDecisionStatus.PENDING_CONFIRMATION) return QuickSaveView.CONFIRM;
  return QuickSaveView.SAVE;
}
