import { db } from '../db/index';
import type { Tag } from '../types/tag';
import { DexieRepository } from './DexieRepository';
import type { ITagRepository } from './interfaces/ITagRepository';

export class TagRepository extends DexieRepository<Tag, string> implements ITagRepository {
  constructor() {
    super(db.tags);
  }

  // No FK cascade in Dexie — strip the deleted tag's id out of every
  // bookmarkTags.tagIds array in the same transaction as the tag's own removal.
  override async remove(id: string): Promise<void> {
    await db.transaction('rw', this.table, db.bookmarkTags, async () => {
      await db.bookmarkTags
        .where('tagIds')
        .equals(id)
        .modify((link) => {
          link.tagIds = link.tagIds.filter((tagId) => tagId !== id);
        });
      await this.table.delete(id);
    });
  }
}
