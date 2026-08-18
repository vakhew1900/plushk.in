import type { BookmarkRule } from '../../types/rule';
import type { ICrudRepository } from './ICrudRepository';

export interface IBookmarkRuleRepository extends ICrudRepository<BookmarkRule> {
  /** Removes `id` and every descendant of it (see RULE-10 — cascade delete). */
  removeWithDescendants(id: string): Promise<void>;
}
