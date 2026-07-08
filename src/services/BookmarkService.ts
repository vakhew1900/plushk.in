import type { PageMeta } from '../types/page-meta';
import type { BookmarkDecision, IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from './interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IBookmarkService } from './interfaces/IBookmarkService';

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
  ) {}

  async handleBookmarkCreated(bookmarkId: string, meta: PageMeta): Promise<BookmarkDecision> {
    const decision = await this.modeHandler.onBookmarkSelected(meta);

    if (decision.status === BookmarkDecisionStatus.PLACED && decision.targetFolder) {
      await this.bookmarkRepository.move(bookmarkId, decision.targetFolder);
    }

    return decision;
  }

  async confirmPlacement(bookmarkId: string, targetFolder: string): Promise<void> {
    await this.bookmarkRepository.move(bookmarkId, targetFolder);
  }
}
