import { findMatchingRule } from '../lib/visitor/rule-evaluator';
import type { PageMeta } from '../types/page-meta';
import type { IBookmarkRuleRepository } from '../repository/interfaces/IBookmarkRuleRepository';
import type { IDefaultFolderSettingsRepository } from '../repository/interfaces/IDefaultFolderSettingsRepository';
import type { IQuickSaveFolderResolver } from './interfaces/IQuickSaveFolderResolver';

export class QuickSaveFolderResolver implements IQuickSaveFolderResolver {
  constructor(
    private readonly bookmarkRuleRepository: IBookmarkRuleRepository,
    private readonly defaultFolderSettingsRepository: IDefaultFolderSettingsRepository,
  ) {}

  async resolve(meta: PageMeta): Promise<string> {
    const rules = await this.bookmarkRuleRepository.getAll();
    const matchedRule = findMatchingRule(rules, meta);
    return matchedRule?.targetFolder ?? (await this.defaultFolderSettingsRepository.get());
  }
}
