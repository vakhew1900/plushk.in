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
}
