import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';

export interface IBookmarkSearchService {
  /**
   * Case-insensitive substring match over title, URL and folder path.
   * An empty/whitespace-only query returns every bookmark.
   */
  search(query: string): Promise<BookmarkSearchEntry[]>;
}
