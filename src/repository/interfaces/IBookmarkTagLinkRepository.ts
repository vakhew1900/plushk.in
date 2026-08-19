import type { BookmarkTagLink } from '../../types/bookmark-tag-link';
import type { ICrudRepository } from './ICrudRepository';

export interface IBookmarkTagLinkRepository extends ICrudRepository<BookmarkTagLink> {
  /** Bookmark ids linked to any of the given tags (OR). Empty input returns `[]` without querying. */
  getBookmarkIdsByTagIds(tagIds: string[]): Promise<string[]>;
}
