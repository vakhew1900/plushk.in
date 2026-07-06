import type { PageMeta } from '../../types/page-meta';
import type { BookmarkRule } from '../../types/rule';

// Fallback target when no rule matches (see CLAUDE.md's rule system spec).
export const UNCATEGORIZED_FOLDER = 'Uncategorized';

// What happened (or should happen next) as a result of onBookmarkSelected:
//  - PLACED:               the mode owns saving the bookmark itself (Auto).
//  - PENDING_CONFIRMATION: a folder was suggested, but nothing is saved yet —
//                          the caller must confirm (or let the user change it)
//                          before the bookmark is actually placed (Hint).
//  - NOT_HANDLED:          this mode never touches bookmark placement — the
//                          browser's own default action applies untouched (Off).
export const BookmarkDecisionStatus = {
  PLACED: 'placed',
  PENDING_CONFIRMATION: 'pendingConfirmation',
  NOT_HANDLED: 'notHandled',
} as const;
export type BookmarkDecisionStatus = typeof BookmarkDecisionStatus[keyof typeof BookmarkDecisionStatus];

export interface BookmarkDecision {
  readonly status: BookmarkDecisionStatus;
  readonly targetFolder?: string;
  readonly matchedRule?: BookmarkRule;
}

export interface IBookmarkModeHandler {
  onBookmarkSelected(meta: PageMeta): Promise<BookmarkDecision>;
}
