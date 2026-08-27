import { db } from '../db/index';
import type { BookmarkTagLink } from '../types/bookmark-tag-link';
import { DexieRepository } from './DexieRepository';
import type { IBookmarkTagLinkRepository } from './interfaces/IBookmarkTagLinkRepository';

export class BookmarkTagLinkRepository
  extends DexieRepository<BookmarkTagLink, string>
  implements IBookmarkTagLinkRepository
{
  constructor() {
    super(db.bookmarkTags);
  }

  async getBookmarkIdsByTagIds(tagIds: string[]): Promise<string[]> {
    if (tagIds.length === 0) return [];
    const links = await db.bookmarkTags.where('tagIds').anyOf(tagIds).toArray();
    return [...new Set(links.map((link) => link.bookmarkId))];
  }
}
