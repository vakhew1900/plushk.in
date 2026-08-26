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

    const folderMatched = filters?.folderPath
      ? textMatched.filter((entry) => this.matchesFolder(entry.folderPath, filters.folderPath!))
      : textMatched;

    const idFilter = await this.resolveIdFilter(filters);
    if (idFilter === null) return folderMatched;

    return folderMatched.filter((entry) => idFilter.has(entry.id));
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

  // `entry.folderPath` is container-prefixed (root-most segment is the fixed
  // container's own title — see BookmarkSearchEntry's doc comment), while
  // `filterPath` comes from FolderNode.path, which is container-agnostic
  // (BookmarkRepository.parseFolderTree resets it under fixed containers, the
  // same convention BookmarkRule.targetFolder is written in). Drop the
  // leading container segment before comparing the two, then match `filterPath`
  // as a prefix of what's left — recursive, so subfolders match too.
  private matchesFolder(folderPath: string[], filterPath: string): boolean {
    const filterSegments = filterPath.split('/').filter(Boolean);
    const relativePath = folderPath.slice(1);
    if (filterSegments.length > relativePath.length) return false;
    return filterSegments.every((segment, i) => relativePath[i] === segment);
  }

  private matches(entry: BookmarkSearchEntry, needle: string): boolean {
    return (
      entry.title.toLowerCase().includes(needle) ||
      entry.url.toLowerCase().includes(needle) ||
      entry.folderPath.some((segment) => segment.toLowerCase().includes(needle))
    );
  }
}
