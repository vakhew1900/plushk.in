import type { BookmarkRule } from '../../../types/rule';
import type { IBookmarkRuleRepository } from '../../interfaces/IBookmarkRuleRepository';

/**
 * Shared in-memory fake — used by more than one `services/__tests__/*` spec
 * (`QuickSaveFolderResolver`, `SettingsExportImportService`). Kept in one
 * place instead of duplicated per test file so both stay in sync with the
 * real `IBookmarkRuleRepository` contract (e.g. RULE-10's
 * `removeWithDescendants`) automatically.
 */
export class FakeBookmarkRuleRepository implements IBookmarkRuleRepository {
  constructor(public rules: BookmarkRule[] = []) {}

  async getAll(): Promise<BookmarkRule[]> {
    return this.rules;
  }

  async getById(id: string): Promise<BookmarkRule | undefined> {
    return this.rules.find((r) => r.id === id);
  }

  async save(rule: BookmarkRule): Promise<void> {
    this.rules = [...this.rules.filter((r) => r.id !== rule.id), rule];
  }

  async remove(id: string): Promise<void> {
    this.rules = this.rules.filter((r) => r.id !== id);
  }

  async removeWithDescendants(id: string): Promise<void> {
    this.rules = this.rules.filter((r) => r.id !== id && r.parentId !== id);
  }
}
