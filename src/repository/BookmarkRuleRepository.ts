import { db } from '../db/index';
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
}
