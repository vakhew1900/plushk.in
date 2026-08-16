import { db } from '../db/index';
import { collectSubtreeIds } from '../lib/rule-tree';
import { BookmarkRuleField, type BookmarkRule } from '../types/rule';
import { DexieRepository } from './DexieRepository';
import type { IBookmarkRuleRepository } from './interfaces/IBookmarkRuleRepository';

export class BookmarkRuleRepository extends DexieRepository<BookmarkRule, string> implements IBookmarkRuleRepository {
  constructor() {
    super(db.rules);
  }

  protected override queryAll(): Promise<BookmarkRule[]> {
    return this.table.orderBy(BookmarkRuleField.PRIORITY).reverse().toArray();
  }

  async removeWithDescendants(id: string): Promise<void> {
    const all = await this.getAll();
    const ids = collectSubtreeIds(all, id);
    await this.table.bulkDelete(ids);
  }
}
