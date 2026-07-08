import type { Browser } from 'wxt/browser';
import type { BookmarkDecision, IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from './interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IBookmarkService } from './interfaces/IBookmarkService';
import type { IPageMetaFiller } from './interfaces/IPageMetaFiller';

/**
 * Ties a mode's decision to the actual `browser.bookmarks` gateway.
 * The browser always creates the bookmark itself first (default placement);
 * this only moves it afterwards when the mode both places it and resolved
 * a folder for it.
 */
export class BookmarkService implements IBookmarkService {
  constructor(
    private readonly modeHandler: IBookmarkModeHandler,
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly pageMetaFiller: IPageMetaFiller,
  ) {}

  async handleBookmarkCreated(bookmark: Browser.bookmarks.BookmarkTreeNode): Promise<BookmarkDecision> {
    const meta = await this.pageMetaFiller.fillPageMeta(bookmark);
    const decision = await this.modeHandler.onBookmarkSelected(meta);

    if (decision.status === BookmarkDecisionStatus.PLACED && decision.targetFolder) {
      await this.bookmarkRepository.move(bookmark.id, decision.targetFolder);
    }

    return decision;
  }
}
