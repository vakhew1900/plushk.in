import type { Browser } from 'wxt/browser';
import type { BookmarkDecision, IBookmarkModeHandler } from './handler/interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from './handler/interfaces/IBookmarkModeHandler';
import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IDefaultFolderSettingsRepository } from '../repository/interfaces/IDefaultFolderSettingsRepository';
import type { IBookmarkService } from './interfaces/IBookmarkService';
import type { IPageMetaFiller } from './interfaces/IPageMetaFiller';

/**
 * Ties a mode's decision to the actual `browser.bookmarks` gateway.
 * The browser always creates the bookmark itself first (default placement);
 * this only moves it afterwards when the mode places it — into the matched
 * rule's folder, or into the user-configured default folder (empty by
 * default, meaning the Bookmarks Toolbar) when no rule matched.
 */
export class BookmarkService implements IBookmarkService {
  constructor(
    private readonly modeHandler: IBookmarkModeHandler,
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly pageMetaFiller: IPageMetaFiller,
    private readonly defaultFolderSettingsRepository: IDefaultFolderSettingsRepository,
  ) {}

  async handleBookmarkCreated(bookmark: Browser.bookmarks.BookmarkTreeNode): Promise<BookmarkDecision> {
    const meta = await this.pageMetaFiller.fillPageMeta(bookmark);
    const decision = await this.modeHandler.onBookmarkSelected(meta);

    if (decision.status === BookmarkDecisionStatus.PLACED) {
      const targetFolder = decision.targetFolder ?? (await this.defaultFolderSettingsRepository.get());
      await this.bookmarkRepository.move(bookmark.id, targetFolder);
    }

    return decision;
  }
}
