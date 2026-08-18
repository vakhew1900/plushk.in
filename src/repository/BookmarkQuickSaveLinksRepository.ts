import { db } from '../db/index';
import type { IBookmarkQuickSaveLinksRepository, QuickSaveLinks } from './interfaces/IBookmarkQuickSaveLinksRepository';

export class BookmarkQuickSaveLinksRepository implements IBookmarkQuickSaveLinksRepository {
  async save({ bookmarkId, tagIds, entityTypeId, statusId }: QuickSaveLinks): Promise<void> {
    await db.transaction('rw', db.bookmarkTags, db.bookmarkEntityLinks, async () => {
      if (tagIds.length > 0) {
        await db.bookmarkTags.put({ bookmarkId, tagIds });
      }
      if (entityTypeId !== undefined) {
        await db.bookmarkEntityLinks.put({ bookmarkId, entityTypeId, statusId });
      }
    });
  }
}
