import { describe, expect, it } from 'vitest';
import { PageSelectorType } from '../../types/page-match';
import type { PageMatchGroup } from '../../types/page-match';
import { RuleType } from '../../types/rule';
import type { BookmarkRule } from '../../types/rule';
import type { DomainAlias } from '../../types/domain-alias';
import { SETTINGS_EXPORT_VERSION } from '../../types/settings-export';
import type { SettingsExport } from '../../types/settings-export';
import type { IBookmarkRuleRepository } from '../../repository/interfaces/IBookmarkRuleRepository';
import type { IDomainAliasRepository } from '../../repository/interfaces/IDomainAliasRepository';
import type { IPageMatchGroupRepository } from '../../repository/interfaces/IPageMatchGroupRepository';
import { MimeType } from '../interfaces/IFileService';
import type { IFileService } from '../interfaces/IFileService';
import { SettingsExportImportService } from '../SettingsExportImportService';

class FakeBookmarkRuleRepository implements IBookmarkRuleRepository {
  constructor(public rules: BookmarkRule[] = []) {}
  async getAll(): Promise<BookmarkRule[]> { return this.rules; }
  async getById(id: string): Promise<BookmarkRule | undefined> { return this.rules.find((r) => r.id === id); }
  async save(rule: BookmarkRule): Promise<void> {
    this.rules = [...this.rules.filter((r) => r.id !== rule.id), rule];
  }
  async remove(id: string): Promise<void> {
    this.rules = this.rules.filter((r) => r.id !== id);
  }
}

class FakeDomainAliasRepository implements IDomainAliasRepository {
  constructor(public aliases: DomainAlias[] = []) {}
  async getAll(): Promise<DomainAlias[]> { return this.aliases; }
  async getById(id: string): Promise<DomainAlias | undefined> { return this.aliases.find((a) => a.id === id); }
  async save(alias: DomainAlias): Promise<void> {
    this.aliases = [...this.aliases.filter((a) => a.id !== alias.id), alias];
  }
  async remove(id: string): Promise<void> {
    this.aliases = this.aliases.filter((a) => a.id !== id);
  }
}

class FakePageMatchGroupRepository implements IPageMatchGroupRepository {
  constructor(public groups: PageMatchGroup[] = []) {}
  async getAll(): Promise<PageMatchGroup[]> { return this.groups; }
  async getById(id: string): Promise<PageMatchGroup | undefined> { return this.groups.find((g) => g.id === id); }
  async save(group: PageMatchGroup): Promise<void> {
    this.groups = [...this.groups.filter((g) => g.id !== group.id), group];
  }
  async remove(id: string): Promise<void> {
    this.groups = this.groups.filter((g) => g.id !== id);
  }
}

class FakeFileService implements IFileService {
  public saved?: { filename: string; content: string; mimeType?: MimeType };
  async save(filename: string, content: string, mimeType?: MimeType): Promise<void> {
    this.saved = { filename, content, mimeType };
  }
}

const rule: BookmarkRule = {
  id: 'rule-1',
  name: 'youtube',
  condition: { type: RuleType.TERM, field: 'domain', value: 'youtube.com' },
  targetFolder: 'Videos',
  priority: 10,
  enabled: true,
};

const alias: DomainAlias = { id: 'alias-1', name: 'youtube', domain_names: ['youtube.com', 'youtu.be'] };

const group: PageMatchGroup = {
  id: 'group-1',
  aliasId: 'alias-1',
  pageMatches: new Map([['title', { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1' } }]]),
};

function makeService(seed?: { rules?: BookmarkRule[]; aliases?: DomainAlias[]; groups?: PageMatchGroup[] }) {
  const ruleRepository = new FakeBookmarkRuleRepository(seed?.rules);
  const aliasRepository = new FakeDomainAliasRepository(seed?.aliases);
  const groupRepository = new FakePageMatchGroupRepository(seed?.groups);
  const fileService = new FakeFileService();
  const service = new SettingsExportImportService(ruleRepository, aliasRepository, groupRepository, fileService);
  return { service, ruleRepository, aliasRepository, groupRepository, fileService };
}

describe('SettingsExportImportService.exportSettings', () => {
  it('gathers rules, aliases, and page match groups and downloads them as a versioned JSON file', async () => {
    const { service, fileService } = makeService({ rules: [rule], aliases: [alias], groups: [group] });
    await service.exportSettings();

    expect(fileService.saved?.mimeType).toBe(MimeType.JSON);
    expect(fileService.saved?.filename).toMatch(/^plushkin-settings-\d{4}-\d{2}-\d{2}\.json$/);

    const data = JSON.parse(fileService.saved!.content) as SettingsExport;
    expect(data.version).toBe(SETTINGS_EXPORT_VERSION);
    expect(data.rules).toEqual([rule]);
    expect(data.domainAliases).toEqual([alias]);
    expect(data.pageMatchGroups).toEqual([
      { id: 'group-1', aliasId: 'alias-1', pageMatches: { title: { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1' } } } },
    ]);
    expect(typeof data.exportedAt).toBe('string');
  });
});

describe('SettingsExportImportService.importSettings', () => {
  it('upserts by id, leaving existing rows not present in the file untouched', async () => {
    const existingRule: BookmarkRule = { ...rule, id: 'rule-existing', name: 'existing' };
    const { service, ruleRepository, aliasRepository, groupRepository } = makeService({ rules: [existingRule] });

    await service.importSettings({
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: '2026-07-24T00:00:00.000Z',
      rules: [rule],
      domainAliases: [alias],
      pageMatchGroups: [
        { id: 'group-1', aliasId: 'alias-1', pageMatches: { title: { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1' } } } },
      ],
    });

    expect(ruleRepository.rules).toEqual(expect.arrayContaining([existingRule, rule]));
    expect(aliasRepository.aliases).toEqual([alias]);
    expect(groupRepository.groups).toEqual([group]);
  });

  it('overwrites an existing row that shares an id with an imported one', async () => {
    const staleRule: BookmarkRule = { ...rule, name: 'stale', targetFolder: 'Old' };
    const { service, ruleRepository } = makeService({ rules: [staleRule] });

    await service.importSettings({
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: '2026-07-24T00:00:00.000Z',
      rules: [rule],
      domainAliases: [],
      pageMatchGroups: [],
    });

    expect(ruleRepository.rules).toEqual([rule]);
  });

  it('rejects a malformed payload without writing anything', async () => {
    const { service, ruleRepository } = makeService({ rules: [rule] });

    await expect(service.importSettings({ not: 'valid' })).rejects.toThrow('Invalid settings export file');
    expect(ruleRepository.rules).toEqual([rule]);
  });
});
