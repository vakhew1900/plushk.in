import { describe, expect, it } from 'vitest';
import { BookmarkDecisionStatus } from '../../services/interfaces/IBookmarkModeHandler';
import { QuickSaveView, getQuickSaveView } from '../quick-save-view';

describe('getQuickSaveView', () => {
  it('shows the saved view once saved, regardless of status', () => {
    expect(getQuickSaveView(true, BookmarkDecisionStatus.PLACED, false)).toBe(QuickSaveView.SAVED);
    expect(getQuickSaveView(true, BookmarkDecisionStatus.NOT_HANDLED, true)).toBe(QuickSaveView.SAVED);
  });

  it('shows the off view when the mode does not handle bookmarks', () => {
    expect(getQuickSaveView(false, BookmarkDecisionStatus.NOT_HANDLED, false)).toBe(QuickSaveView.OFF);
  });

  it('shows the confirm view only when confirming a pending suggestion', () => {
    expect(getQuickSaveView(false, BookmarkDecisionStatus.PENDING_CONFIRMATION, true)).toBe(
      QuickSaveView.CONFIRM,
    );
  });

  it('shows the save button for placed mode', () => {
    expect(getQuickSaveView(false, BookmarkDecisionStatus.PLACED, false)).toBe(QuickSaveView.SAVE);
  });

  it('shows the save button for a pending suggestion before confirming starts', () => {
    expect(getQuickSaveView(false, BookmarkDecisionStatus.PENDING_CONFIRMATION, false)).toBe(
      QuickSaveView.SAVE,
    );
  });
});
