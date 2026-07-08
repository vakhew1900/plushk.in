import type { Browser } from 'wxt/browser';
import type { PageMeta } from '../types/page-meta';
import type { IPageMetaFiller } from './interfaces/IPageMetaFiller';

/**
 * Minimal `PageMeta` straight from the `bookmarks.onCreated` event — no page
 * content. This is the seam for a future content-script-based filler that
 * enriches description/tags/content; callers only depend on `IPageMetaFiller`.
 */
export class PageMetaFiller implements IPageMetaFiller {
  async fillPageMeta(bookmark: Browser.bookmarks.BookmarkTreeNode): Promise<PageMeta> {
    const url = bookmark.url ?? '';
    return {
      url,
      domain: url ? new URL(url).hostname : '',
      title: bookmark.title,
    };
  }
}
