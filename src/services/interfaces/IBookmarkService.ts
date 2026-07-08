import type { Browser } from 'wxt/browser';
import type { BookmarkDecision } from './IBookmarkModeHandler';

export interface IBookmarkService {
  /**
   * Fills in `PageMeta` for a just-created bookmark, runs the active mode's
   * decision, and — if the mode places it itself with a resolved folder —
   * moves it there.
   */
  handleBookmarkCreated(bookmark: Browser.bookmarks.BookmarkTreeNode): Promise<BookmarkDecision>;
}
