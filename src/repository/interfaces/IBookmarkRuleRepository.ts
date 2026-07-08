import type { BookmarkRule } from '../../../types/rule';

export interface IBookmarkRuleRepository {
  getAll(): Promise<BookmarkRule[]>;
  getById(id: string): Promise<BookmarkRule | undefined>;
  save(rule: BookmarkRule): Promise<void>;
  remove(id: string): Promise<void>;
}
