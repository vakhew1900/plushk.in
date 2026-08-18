import { describe, expect, it } from 'vitest';
import { Mode } from '../../types/mode';
import { QuickSaveView, getQuickSaveView } from '../quick-save-view';

describe('getQuickSaveView', () => {
  it('shows the saved view once saved, regardless of mode', () => {
    expect(getQuickSaveView(true, Mode.ON)).toBe(QuickSaveView.SAVED);
    expect(getQuickSaveView(true, Mode.OFF)).toBe(QuickSaveView.SAVED);
  });

  it('shows the off view when mode is Off', () => {
    expect(getQuickSaveView(false, Mode.OFF)).toBe(QuickSaveView.OFF);
  });

  it('shows the save view (tree + save button) when mode is On', () => {
    expect(getQuickSaveView(false, Mode.ON)).toBe(QuickSaveView.SAVE);
  });
});
