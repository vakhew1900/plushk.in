import { describe, expect, it } from 'vitest';
import type { PageMeta } from '../../types/page-meta';
import type { BookmarkRule } from '../../types/rule';
import { RuleType } from '../../types/rule';
import type { IBookmarkRuleRepository } from '../../repository/interfaces/IBookmarkRuleRepository';
import type { IDefaultFolderSettingsRepository } from '../../repository/interfaces/IDefaultFolderSettingsRepository';
import { QuickSaveFolderResolver } from '../QuickSaveFolderResolver';

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

function makeDefaultFolderSettingsRepository(defaultFolder = ''): IDefaultFolderSettingsRepository {
  return {
    get: async () => defaultFolder,
    set: async () => {},
  };
}

const matchingRule = makeRule({
  id: 'youtube-rule',
  targetFolder: 'Videos',
  condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
  tagIds: ['tag-tutorial'],
  entityTypeId: 'entity-video',
  statusId: 'status-to-watch',
});

const nonMatchingRule = makeRule({
  id: 'github-rule',
  targetFolder: 'Code',
  condition: { type: RuleType.TERM, field: 'domain', value: 'github.com' },
});

describe('QuickSaveFolderResolver.resolve', () => {
  it('resolves the matched rule\'s target folder plus its tag/entity suggestion', async () => {
    const resolver = new QuickSaveFolderResolver(
      new FakeBookmarkRuleRepository([nonMatchingRule, matchingRule]),
      makeDefaultFolderSettingsRepository(),
    );

    expect(await resolver.resolve(meta)).toEqual({
      targetFolder: 'Videos',
      matchedRuleName: 'youtube-rule',
      tagIds: ['tag-tutorial'],
      entityTypeId: 'entity-video',
      statusId: 'status-to-watch',
    });
  });

  it('falls back to the configured default folder when nothing matches, with no rule suggestion', async () => {
    const resolver = new QuickSaveFolderResolver(
      new FakeBookmarkRuleRepository([nonMatchingRule]),
      makeDefaultFolderSettingsRepository('Reading/Later'),
    );

    expect(await resolver.resolve(meta)).toEqual({ targetFolder: 'Reading/Later' });
  });

  it('falls back to the empty string (Bookmarks Toolbar) when nothing matches and no default is configured', async () => {
    const resolver = new QuickSaveFolderResolver(
      new FakeBookmarkRuleRepository([nonMatchingRule]),
      makeDefaultFolderSettingsRepository(''),
    );

    expect(await resolver.resolve(meta)).toEqual({ targetFolder: '' });
  });

  it('skips a disabled matching rule', async () => {
    const disabled = { ...matchingRule, enabled: false };
    const resolver = new QuickSaveFolderResolver(
      new FakeBookmarkRuleRepository([disabled]),
      makeDefaultFolderSettingsRepository('Reading/Later'),
    );

    expect(await resolver.resolve(meta)).toEqual({ targetFolder: 'Reading/Later' });
  });

  it('omits a matched rule\'s tag/entity fields from the resolution when the rule leaves them unset', async () => {
    const resolver = new QuickSaveFolderResolver(
      new FakeBookmarkRuleRepository([nonMatchingRule, { ...matchingRule, tagIds: undefined, entityTypeId: undefined, statusId: undefined }]),
      makeDefaultFolderSettingsRepository(),
    );

    expect(await resolver.resolve(meta)).toEqual({ targetFolder: 'Videos', matchedRuleName: 'youtube-rule' });
  });
});
