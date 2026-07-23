import type { PageMeta } from '../../types/page-meta';
import type { BookmarkDecision, IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from './interfaces/IBookmarkModeHandler';

/**
 * Off mode never interferes — no rule is evaluated, no folder is decided.
 * Whatever creates the bookmark (the browser's own default action) should
 * proceed completely untouched by this handler.
 */
export class OffModeHandler implements IBookmarkModeHandler {
  readonly status = BookmarkDecisionStatus.NOT_HANDLED;

  async onBookmarkSelected(_meta: PageMeta): Promise<BookmarkDecision> {
    return { status: BookmarkDecisionStatus.NOT_HANDLED };
  }
}
