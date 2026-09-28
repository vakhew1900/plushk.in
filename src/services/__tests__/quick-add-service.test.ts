import { describe, expect, it } from 'vitest';
import type { DomainAlias } from '../../types/domain-alias';
import { PageSelectorType, type PageMatchGroup } from '../../types/page-match';
import { IconRuleBindingType, IconSourceType, type IconRule } from '../../types/icon-rule';
import type { IDomainAliasService } from '../interfaces/IDomainAliasService';
import type { IPageMatchGroupService } from '../interfaces/IPageMatchGroupService';
import { FakeIconRuleRepository } from '../../repository/__tests__/fakes/FakeIconRuleRepository';
import { QuickAddService } from '../QuickAddService';

// One-off fakes (only this spec uses them) — unlike FakeDomainAliasRepository/
// FakePageMatchGroupRepository (repository/__tests__/fakes/), these are hand-
// controlled: QuickAddService no longer resolves aliases/groups itself (that's
// DomainAliasService's/PageMatchGroupService's own job, tested separately in
// domain-alias-service.test.ts/page-match-group-service.test.ts) — these specs
// only need to verify QuickAddService uses whatever those services hand back.
class FakeDomainAliasService implements IDomainAliasService {
  constructor(private readonly alias: DomainAlias) {}

  async findOrCreateForDomain(): Promise<DomainAlias> {
    return this.alias;
  }
}

class FakePageMatchGroupService implements IPageMatchGroupService {
  public savedGroups: PageMatchGroup[] = [];

  constructor(private readonly group: PageMatchGroup) {}

  async findOrCreateForAlias(): Promise<PageMatchGroup> {
    return this.group;
  }

  async save(group: PageMatchGroup): Promise<void> {
    this.savedGroups.push(group);
  }
}

function makeService(init: { alias?: DomainAlias; group?: PageMatchGroup; rules?: IconRule[] } = {}) {
  const alias: DomainAlias = init.alias ?? { id: 'alias-1', name: 'example.ru', domain_names: ['example.ru'] };
  const group: PageMatchGroup = init.group ?? { id: 'g1', aliasId: alias.id, pageMatches: new Map() };
  const domainAliasService = new FakeDomainAliasService(alias);
  const pageMatchGroupService = new FakePageMatchGroupService(group);
  const iconRuleRepository = new FakeIconRuleRepository(init.rules ?? []);
  const service = new QuickAddService(domainAliasService, pageMatchGroupService, iconRuleRepository);
  return { service, alias, group, pageMatchGroupService, iconRuleRepository };
}

describe('QuickAddService.saveVariable', () => {
  it('adds a field to the group DomainAliasService/PageMatchGroupService resolved, and saves it', async () => {
    const { service, group, pageMatchGroupService } = makeService();

    const result = await service.saveVariable({ domain: 'example.ru', name: 'author', selector: '.author' });

    expect(result).toEqual({ ok: true });
    expect(group.pageMatches.get('author')).toEqual({ name: 'author', selector: { type: PageSelectorType.CSS, value: '.author' } });
    expect(pageMatchGroupService.savedGroups).toEqual([group]);
  });

  it('rejects with duplicate-name and does not overwrite an existing field with the same name', async () => {
    const group: PageMatchGroup = {
      id: 'g1',
      aliasId: 'alias-1',
      pageMatches: new Map([['author', { name: 'author', selector: { type: PageSelectorType.CSS, value: '.old-selector' } }]]),
    };
    const { service, pageMatchGroupService } = makeService({ group });

    const result = await service.saveVariable({ domain: 'example.ru', name: 'author', selector: '.new-selector' });

    expect(result).toEqual({ ok: false, error: 'duplicate-name' });
    expect(group.pageMatches.get('author')?.selector.value).toBe('.old-selector');
    expect(pageMatchGroupService.savedGroups).toEqual([]); // never saved — the duplicate is rejected before persisting
  });
});

describe('QuickAddService.saveIcon', () => {
  it('creates a domain-bound IconRule with a CSS source', async () => {
    const { service, iconRuleRepository } = makeService();

    const result = await service.saveIcon({ domain: 'example.ru', name: 'логотип', selector: '.hero-card img' });

    expect(result).toEqual({ ok: true });
    expect(iconRuleRepository.rules).toEqual([{
      id: expect.any(String),
      name: 'логотип',
      bindingType: IconRuleBindingType.DOMAIN,
      bindingValue: 'example.ru',
      source: { type: IconSourceType.CSS, value: '.hero-card img' },
      enabled: true,
    }]);
  });

  it('rejects with duplicate-name when a rule with the same name already exists for the same domain', async () => {
    const existing: IconRule = {
      id: 'r1', name: 'логотип', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'example.ru',
      source: { type: IconSourceType.CSS, value: '.old' }, enabled: true,
    };
    const { service, iconRuleRepository } = makeService({ rules: [existing] });

    const result = await service.saveIcon({ domain: 'example.ru', name: 'логотип', selector: '.new' });

    expect(result).toEqual({ ok: false, error: 'duplicate-name' });
    expect(iconRuleRepository.rules).toEqual([existing]);
  });

  it('does not treat a same-name rule on a different domain as a duplicate', async () => {
    const existing: IconRule = {
      id: 'r1', name: 'логотип', bindingType: IconRuleBindingType.DOMAIN, bindingValue: 'other.ru',
      source: { type: IconSourceType.CSS, value: '.old' }, enabled: true,
    };
    const { service, iconRuleRepository } = makeService({ rules: [existing] });

    const result = await service.saveIcon({ domain: 'example.ru', name: 'логотип', selector: '.new' });

    expect(result).toEqual({ ok: true });
    expect(iconRuleRepository.rules).toHaveLength(2);
  });
});
