import type { IBookmarkRepository } from '../repository/interfaces/IBookmarkRepository';
import type { IBookmarkTagLinkRepository } from '../repository/interfaces/IBookmarkTagLinkRepository';
import type { IBookmarkEntityLinkRepository } from '../repository/interfaces/IBookmarkEntityLinkRepository';
import type { BookmarkSearchEntry } from '../types/bookmark-search-entry';
import type { BookmarkSearchFilters } from '../types/bookmark-search-filters';
import type { IBookmarkSearchService } from './interfaces/IBookmarkSearchService';

export class BookmarkSearchService implements IBookmarkSearchService {
  constructor(
    private readonly bookmarkRepository: IBookmarkRepository,
    private readonly bookmarkTagLinkRepository: IBookmarkTagLinkRepository,
    private readonly bookmarkEntityLinkRepository: IBookmarkEntityLinkRepository,
  ) {}

  async search(query: string, filters?: BookmarkSearchFilters): Promise<BookmarkSearchEntry[]> {
    const entries = await this.bookmarkRepository.listAll();
    const needle = query.trim().toLowerCase();
    const textMatched = needle ? entries.filter((entry) => this.matches(entry, needle)) : entries;

    const idFilter = await this.resolveIdFilter(filters);
    if (idFilter === null) return textMatched;

    return textMatched.filter((entry) => idFilter.has(entry.id));
  }

  private async resolveIdFilter(filters?: BookmarkSearchFilters): Promise<Set<string> | null> {
    if (!filters) return null;

    const facetSets: Set<string>[] = [];

    if (filters.tagIds.length > 0) {
      facetSets.push(new Set(await this.bookmarkTagLinkRepository.getBookmarkIdsByTagIds(filters.tagIds)));
    }
    if (filters.entityTypeId) {
      facetSets.push(
        new Set(
          await this.bookmarkEntityLinkRepository.getBookmarkIdsByEntityType(
            filters.entityTypeId,
            filters.statusId,
          ),
        ),
      );
    }

    if (facetSets.length === 0) return null;
    return facetSets.reduce((a, b) => new Set([...a].filter((id) => b.has(id))));
  }

  private matches(entry: BookmarkSearchEntry, needle: string): boolean {
    return (
      entry.title.toLowerCase().includes(needle) ||
      entry.url.toLowerCase().includes(needle) ||
      entry.folderPath.some((segment) => segment.toLowerCase().includes(needle))
    );
  }
}
