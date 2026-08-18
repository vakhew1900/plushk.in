import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { BookmarkSearchEntry } from '../types/bookmark-search-entry';
import type { IBookmarkSearchService } from './interfaces/IBookmarkSearchService';

export class BookmarkSearchService implements IBookmarkSearchService {
  constructor(private readonly bookmarkRepository: IBookmarkRepository) {}

  async search(query: string): Promise<BookmarkSearchEntry[]> {
    const entries = await this.bookmarkRepository.listAll();
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;

    return entries.filter((entry) => this.matches(entry, needle));
  }

  private matches(entry: BookmarkSearchEntry, needle: string): boolean {
    return (
      entry.title.toLowerCase().includes(needle) ||
      entry.url.toLowerCase().includes(needle) ||
      entry.folderPath.some((segment) => segment.toLowerCase().includes(needle))
    );
  }
}
