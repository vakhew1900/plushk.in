import { findMatchingRule } from '../../lib/visitor/rule-evaluator';
import type { PageMeta } from '../../types/page-meta';
import type { IBookmarkRuleRepository } from '../../repository/interfaces/IBookmarkRuleRepository';
import type { BookmarkDecision, IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus } from './interfaces/IBookmarkModeHandler';

/**
 * Hint mode never places the bookmark itself — it only suggests a folder.
 * The actual save happens via a separate, later user-confirmed action
 * (not modeled by this handler). If no rule matches, `targetFolder` is left
 * undefined: no specific folder is suggested, and confirming falls back to
 * the browser's default placement.
 */
export class HintModeHandler implements IBookmarkModeHandler {
  readonly status = BookmarkDecisionStatus.PENDING_CONFIRMATION;

  constructor(private readonly bookmarkRuleRepository: IBookmarkRuleRepository) {}

  async onBookmarkSelected(meta: PageMeta): Promise<BookmarkDecision> {
    const rules = await this.bookmarkRuleRepository.getAll();
    const matchedRule = findMatchingRule(rules, meta);

    return {
      status: BookmarkDecisionStatus.PENDING_CONFIRMATION,
      targetFolder: matchedRule?.targetFolder,
      matchedRule,
    };
  }
}
