import { findMatchingRule } from '../lib/visitor/rule-evaluator';
import type { PageMeta } from '../types/page-meta';
import type { IBookmarkRuleRepository } from '../repository/interfaces/IBookmarkRuleRepository';
import type { IDefaultFolderSettingsRepository } from '../repository/interfaces/IDefaultFolderSettingsRepository';
import type { IQuickSaveFolderResolver, QuickSaveResolution } from './interfaces/IQuickSaveFolderResolver';
import type { ITargetFolderTemplateService } from './interfaces/ITargetFolderTemplateService';

export class QuickSaveFolderResolver implements IQuickSaveFolderResolver {
  constructor(
    private readonly bookmarkRuleRepository: IBookmarkRuleRepository,
    private readonly defaultFolderSettingsRepository: IDefaultFolderSettingsRepository,
    private readonly targetFolderTemplateService: ITargetFolderTemplateService,
  ) {}

  async resolve(meta: PageMeta): Promise<QuickSaveResolution> {
    const rules = await this.bookmarkRuleRepository.getAll();
    const matchedRule = findMatchingRule(rules, meta);

    if (!matchedRule) {
      return { targetFolder: await this.defaultFolderSettingsRepository.get() };
    }

    return {
      targetFolder: await this.targetFolderTemplateService.resolve(matchedRule.targetFolder, meta),
      matchedRuleName: matchedRule.name,
      tagIds: matchedRule.tagIds,
      entityTypeId: matchedRule.entityTypeId,
      statusId: matchedRule.statusId,
    };
  }
}
