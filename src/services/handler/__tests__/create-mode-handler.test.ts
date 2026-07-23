import { describe, expect, it } from 'vitest';
import { Mode } from '../../../types/mode';
import type { BookmarkRule } from '../../../types/rule';
import type { IBookmarkRuleRepository } from '../../../repository/interfaces/IBookmarkRuleRepository';
import { AutoModeHandler } from '../AutoModeHandler';
import { HintModeHandler } from '../HintModeHandler';
import { OffModeHandler } from '../OffModeHandler';
import { createModeHandler } from '../createModeHandler';

class FakeBookmarkRuleRepository implements IBookmarkRuleRepository {
  async getAll(): Promise<BookmarkRule[]> { return []; }
  async getById(): Promise<BookmarkRule | undefined> { return undefined; }
  async save(): Promise<void> {}
  async remove(): Promise<void> {}
}

describe('createModeHandler', () => {
  const ruleRepository = new FakeBookmarkRuleRepository();

  it('maps Mode.AUTO to AutoModeHandler', () => {
    expect(createModeHandler(Mode.AUTO, ruleRepository)).toBeInstanceOf(AutoModeHandler);
  });

  it('maps Mode.HINT to HintModeHandler', () => {
    expect(createModeHandler(Mode.HINT, ruleRepository)).toBeInstanceOf(HintModeHandler);
  });

  it('maps Mode.OFF to OffModeHandler', () => {
    expect(createModeHandler(Mode.OFF, ruleRepository)).toBeInstanceOf(OffModeHandler);
  });
});
