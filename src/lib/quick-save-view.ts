import { Mode } from '../types/mode';

export const QuickSaveView = {
  SAVED: 'saved',
  OFF: 'off',
  SAVE: 'save',
} as const;
export type QuickSaveView = typeof QuickSaveView[keyof typeof QuickSaveView];

export function getQuickSaveView(saved: boolean, mode: Mode): QuickSaveView {
  if (saved) return QuickSaveView.SAVED;
  if (mode === Mode.OFF) return QuickSaveView.OFF;
  return QuickSaveView.SAVE;
}
