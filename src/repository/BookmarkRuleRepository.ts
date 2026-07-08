import { db } from '../db/index';
import type { BookmarkRule } from '../types/rule';
import type { IBookmarkRuleRepository } from './interfaces/IBookmarkRuleRepository';

export class BookmarkRuleRepository implements IBookmarkRuleRepository {
  async getAll(): Promise<BookmarkRule[]> {
    return db.rules.orderBy('priority').reverse().toArray();
  }

  async getById(id: string): Promise<BookmarkRule | undefined> {
    return db.rules.get(id);
  }

  async save(rule: BookmarkRule): Promise<void> {
    await db.rules.put(rule);
  }

  async remove(id: string): Promise<void> {
    await db.rules.delete(id);
  }
}
