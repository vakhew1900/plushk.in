import type { Browser } from 'wxt/browser';
import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';

export interface IBookmarkRepository {
  /**
   * Creates a bookmark. If `targetFolder` is given, resolves it to a real
   * `parentId` (creating any missing path segments); otherwise the bookmark
   * is created without a `parentId` — the browser's own default placement.
   */
  create(title: string, url: string, targetFolder?: string): Promise<Browser.bookmarks.BookmarkTreeNode>;

  /** Moves an existing bookmark into `targetFolder`, resolving the path first. */
  move(id: string, targetFolder: string): Promise<void>;

  /** Finds bookmarks (not folders) whose title matches exactly. */
  getByTitle(title: string): Promise<Browser.bookmarks.BookmarkTreeNode[]>;

  /** Lists every saved bookmark (leaf nodes only) with the folder path it currently lives in. */
  listAll(): Promise<BookmarkSearchEntry[]>;
}
