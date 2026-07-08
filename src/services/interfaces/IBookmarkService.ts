import type { PageMeta } from '../../types/page-meta';
import type { BookmarkDecision } from './IBookmarkModeHandler';

export interface IBookmarkService {
  /**
   * Runs the active mode's decision for a just-created bookmark and, if the
   * mode places it itself with a resolved folder, moves it there.
   */
  handleBookmarkCreated(bookmarkId: string, meta: PageMeta): Promise<BookmarkDecision>;

  /** Moves a bookmark into `targetFolder` after the user confirms a hint. */
  confirmPlacement(bookmarkId: string, targetFolder: string): Promise<void>;
}
