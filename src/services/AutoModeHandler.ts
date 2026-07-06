import { findMatchingRule } from '../lib/visitor/rule-evaluator';
import type { PageMeta } from '../types/page-meta';
import type { IBookmarkRuleRepository } from './interfaces/data/IBookmarkRuleRepository';
import type { BookmarkDecision, IBookmarkModeHandler } from './interfaces/IBookmarkModeHandler';
import { BookmarkDecisionStatus, UNCATEGORIZED_FOLDER } from './interfaces/IBookmarkModeHandler';

/**
 * Auto mode owns placing the bookmark itself — no user confirmation.
 *
 * TODO(RULE): once a bookmark gateway exists (chrome.bookmarks.create/move +
 * resolving `targetFolder` to a real parentId), this handler should call it
 * here and actually place the bookmark, not just report where it decided to
 * put it. Tracked as a separate backlog task.
 */
export class AutoModeHandler implements IBookmarkModeHandler {
  constructor(private readonly bookmarkRuleRepository: IBookmarkRuleRepository) {}

  async onBookmarkSelected(meta: PageMeta): Promise<BookmarkDecision> {
    const rules = await this.bookmarkRuleRepository.getAll();
    const matchedRule = findMatchingRule(rules, meta);

    return {
      status: BookmarkDecisionStatus.PLACED,
      targetFolder: matchedRule?.targetFolder ?? UNCATEGORIZED_FOLDER,
      matchedRule,
    };
  }
}
