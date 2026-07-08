import { describe, expect, it } from 'vitest';
import type { PageMeta } from '../../types/page-meta';
import type { BookmarkRule } from '../../types/rule';
import { RuleType } from '../../types/rule';
import type { IBookmarkRuleRepository } from '../../repository/interfaces/IBookmarkRuleRepository';
import { BookmarkDecisionStatus } from '../interfaces/IBookmarkModeHandler';
import { AutoModeHandler } from '../AutoModeHandler';
import { HintModeHandler } from '../HintModeHandler';
import { OffModeHandler } from '../OffModeHandler';

const meta: PageMeta = {
  url: 'https://youtube.com/watch?v=abc123',
  domain: 'youtube.com',
  title: 'React Tutorial for Beginners',
};

function makeRule(overrides: Partial<BookmarkRule> & Pick<BookmarkRule, 'id' | 'condition' | 'targetFolder'>): BookmarkRule {
  return {
    name: overrides.id,
    priority: 0,
    enabled: true,
    ...overrides,
  };
}

class FakeBookmarkRuleRepository implements IBookmarkRuleRepository {
  constructor(private rules: BookmarkRule[]) {}
  async getAll(): Promise<BookmarkRule[]> { return this.rules; }
  async getById(id: string): Promise<BookmarkRule | undefined> { return this.rules.find((r) => r.id === id); }
  async save(rule: BookmarkRule): Promise<void> {
    this.rules = [...this.rules.filter((r) => r.id !== rule.id), rule];
  }
  async remove(id: string): Promise<void> {
    this.rules = this.rules.filter((r) => r.id !== id);
  }
}

const matchingRule = makeRule({
  id: 'youtube-rule',
  targetFolder: 'Videos',
  condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
});

const nonMatchingRule = makeRule({
  id: 'github-rule',
  targetFolder: 'Code',
  condition: { type: RuleType.TERM, field: 'domain', value: 'github.com' },
});

describe('AutoModeHandler', () => {
  it('places the bookmark in the matched rule\'s target folder', async () => {
    const handler = new AutoModeHandler(new FakeBookmarkRuleRepository([nonMatchingRule, matchingRule]));
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision).toEqual({
      status: BookmarkDecisionStatus.PLACED,
      targetFolder: 'Videos',
      matchedRule: matchingRule,
    });
  });

  it('leaves targetFolder undefined when nothing matches (browser default applies)', async () => {
    const handler = new AutoModeHandler(new FakeBookmarkRuleRepository([nonMatchingRule]));
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision).toEqual({
      status: BookmarkDecisionStatus.PLACED,
      targetFolder: undefined,
      matchedRule: undefined,
    });
  });

  it('skips a disabled matching rule', async () => {
    const disabled = { ...matchingRule, enabled: false };
    const handler = new AutoModeHandler(new FakeBookmarkRuleRepository([disabled]));
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision.targetFolder).toBeUndefined();
    expect(decision.matchedRule).toBeUndefined();
  });
});

describe('HintModeHandler', () => {
  it('suggests the matched rule\'s target folder, pending confirmation', async () => {
    const handler = new HintModeHandler(new FakeBookmarkRuleRepository([matchingRule]));
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision).toEqual({
      status: BookmarkDecisionStatus.PENDING_CONFIRMATION,
      targetFolder: 'Videos',
      matchedRule: matchingRule,
    });
  });

  it('leaves targetFolder undefined when nothing matches, still pending confirmation', async () => {
    const handler = new HintModeHandler(new FakeBookmarkRuleRepository([nonMatchingRule]));
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision).toEqual({
      status: BookmarkDecisionStatus.PENDING_CONFIRMATION,
      targetFolder: undefined,
      matchedRule: undefined,
    });
  });
});

describe('OffModeHandler', () => {
  it('never decides a target folder or matched rule, regardless of input', async () => {
    const handler = new OffModeHandler();
    const decision = await handler.onBookmarkSelected(meta);

    expect(decision).toEqual({ status: BookmarkDecisionStatus.NOT_HANDLED });
  });
});
