import type { Browser } from 'wxt/browser';
import type { PageMeta } from '../../types/page-meta';

export interface IPageMetaFiller {
  fillPageMeta(bookmark: Browser.bookmarks.BookmarkTreeNode): Promise<PageMeta>;
}
