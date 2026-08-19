import type { BookmarkEntityLink } from '../../types/bookmark-entity-link';
import type { ICrudRepository } from './ICrudRepository';

export interface IBookmarkEntityLinkRepository extends ICrudRepository<BookmarkEntityLink> {
  /** Bookmark ids linked to the given category, optionally narrowed to one workflow status. */
  getBookmarkIdsByEntityType(entityTypeId: string, statusId?: string): Promise<string[]>;
}
