import { db } from '../db/index';
import type { BookmarkEntityLink } from '../types/bookmark-entity-link';
import { DexieRepository } from './DexieRepository';
import type { IBookmarkEntityLinkRepository } from './interfaces/IBookmarkEntityLinkRepository';

export class BookmarkEntityLinkRepository
  extends DexieRepository<BookmarkEntityLink, string>
  implements IBookmarkEntityLinkRepository
{
  constructor() {
    super(db.bookmarkEntityLinks);
  }

  async getBookmarkIdsByEntityType(entityTypeId: string, statusId?: string): Promise<string[]> {
    const links = await db.bookmarkEntityLinks.where('entityTypeId').equals(entityTypeId).toArray();
    const matching = statusId ? links.filter((link) => link.statusId === statusId) : links;
    return matching.map((link) => link.bookmarkId);
  }
}
