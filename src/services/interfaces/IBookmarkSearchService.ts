import type { BookmarkSearchEntry } from '../../types/bookmark-search-entry';
import type { BookmarkSearchFilters } from '../../types/bookmark-search-filters';

export interface IBookmarkSearchService {
  /**
   * Case-insensitive substring match over title, URL and folder path,
   * further narrowed by `filters` if given (AND across tags/category/status,
   * OR within the tag facet). An empty/whitespace-only query with no active
   * filters returns every bookmark.
   */
  search(query: string, filters?: BookmarkSearchFilters): Promise<BookmarkSearchEntry[]>;
}
