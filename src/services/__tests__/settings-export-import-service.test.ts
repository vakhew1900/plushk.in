import { describe, expect, it } from 'vitest';
import { PageSelectorType } from '../../types/page-match';
import type { PageMatchGroup } from '../../types/page-match';
import { RuleType } from '../../types/rule';
import type { BookmarkRule } from '../../types/rule';
import type { DomainAlias } from '../../types/domain-alias';
import { PaletteColor } from '../../types/palette-color';
import type { Tag } from '../../types/tag';
import type { EntityType } from '../../types/entity-type';
import { SETTINGS_EXPORT_VERSION } from '../../types/settings-export';
import type { SettingsExport } from '../../types/settings-export';
import type { IDomainAliasRepository } from '../../repository/interfaces/IDomainAliasRepository';
import type { IPageMatchGroupRepository } from '../../repository/interfaces/IPageMatchGroupRepository';
import type { ITagRepository } from '../../repository/interfaces/ITagRepository';
import type { IEntityTypeRepository } from '../../repository/interfaces/IEntityTypeRepository';
import { MimeType } from '../interfaces/IFileService';
import type { IFileService } from '../interfaces/IFileService';
import { FakeBookmarkRuleRepository } from '../../repository/__tests__/fakes/FakeBookmarkRuleRepository';
import { SettingsExportImportService } from '../SettingsExportImportService';

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

class FakeTagRepository implements ITagRepository {
  constructor(public tags: Tag[] = []) {}
  async getAll(): Promise<Tag[]> { return this.tags; }
  async getById(id: string): Promise<Tag | undefined> { return this.tags.find((t) => t.id === id); }
  async save(tag: Tag): Promise<void> {
    this.tags = [...this.tags.filter((t) => t.id !== tag.id), tag];
  }
  async remove(id: string): Promise<void> {
    this.tags = this.tags.filter((t) => t.id !== id);
  }
}

class FakeEntityTypeRepository implements IEntityTypeRepository {
  constructor(public entityTypes: EntityType[] = []) {}
  async getAll(): Promise<EntityType[]> { return this.entityTypes; }
  async getById(id: string): Promise<EntityType | undefined> { return this.entityTypes.find((e) => e.id === id); }
  async save(entityType: EntityType): Promise<void> {
    this.entityTypes = [...this.entityTypes.filter((e) => e.id !== entityType.id), entityType];
  }
  async remove(id: string): Promise<void> {
    this.entityTypes = this.entityTypes.filter((e) => e.id !== id);
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

const tag: Tag = { id: 'tag-1', name: 'tutorial', color: PaletteColor.TEAL };

const entityType: EntityType = { id: 'entity-1', name: 'Видео', color: PaletteColor.BLUE };

function makeService(seed?: {
  rules?: BookmarkRule[];
  aliases?: DomainAlias[];
  groups?: PageMatchGroup[];
  tags?: Tag[];
  entityTypes?: EntityType[];
}) {
  const ruleRepository = new FakeBookmarkRuleRepository(seed?.rules);
  const aliasRepository = new FakeDomainAliasRepository(seed?.aliases);
  const groupRepository = new FakePageMatchGroupRepository(seed?.groups);
  const tagRepository = new FakeTagRepository(seed?.tags);
  const entityTypeRepository = new FakeEntityTypeRepository(seed?.entityTypes);
  const fileService = new FakeFileService();
  const service = new SettingsExportImportService(
    ruleRepository,
    aliasRepository,
    groupRepository,
    tagRepository,
    entityTypeRepository,
    fileService,
  );
  return { service, ruleRepository, aliasRepository, groupRepository, tagRepository, entityTypeRepository, fileService };
}

describe('SettingsExportImportService.exportSettings', () => {
  it('gathers rules, aliases, page match groups, tags, and entity types and downloads them as a versioned JSON file', async () => {
    const { service, fileService } = makeService({
      rules: [rule],
      aliases: [alias],
      groups: [group],
      tags: [tag],
      entityTypes: [entityType],
    });
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
    expect(data.tags).toEqual([tag]);
    expect(data.entityTypes).toEqual([entityType]);
    expect(typeof data.exportedAt).toBe('string');
  });
});

describe('SettingsExportImportService.importSettings', () => {
  it('upserts by id, leaving existing rows not present in the file untouched', async () => {
    const existingRule: BookmarkRule = { ...rule, id: 'rule-existing', name: 'existing' };
    const { service, ruleRepository, aliasRepository, groupRepository, tagRepository, entityTypeRepository } =
      makeService({ rules: [existingRule] });

    await service.importSettings({
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: '2026-07-24T00:00:00.000Z',
      rules: [rule],
      domainAliases: [alias],
      pageMatchGroups: [
        { id: 'group-1', aliasId: 'alias-1', pageMatches: { title: { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1' } } } },
      ],
      tags: [tag],
      entityTypes: [entityType],
    });

    expect(ruleRepository.rules).toEqual(expect.arrayContaining([existingRule, rule]));
    expect(aliasRepository.aliases).toEqual([alias]);
    expect(groupRepository.groups).toEqual([group]);
    expect(tagRepository.tags).toEqual([tag]);
    expect(entityTypeRepository.entityTypes).toEqual([entityType]);
  });

  it('treats missing tags/entityTypes fields as empty, for backward compatibility with older export files', async () => {
    const { service, ruleRepository, tagRepository, entityTypeRepository } = makeService();

    await service.importSettings({
      version: SETTINGS_EXPORT_VERSION,
      exportedAt: '2026-07-24T00:00:00.000Z',
      rules: [rule],
      domainAliases: [],
      pageMatchGroups: [],
    });

    expect(ruleRepository.rules).toEqual([rule]);
    expect(tagRepository.tags).toEqual([]);
    expect(entityTypeRepository.entityTypes).toEqual([]);
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
