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
}
