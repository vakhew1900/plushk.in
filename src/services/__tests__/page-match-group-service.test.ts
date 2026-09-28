import { describe, expect, it } from 'vitest';
import { PageSelectorType, type PageMatchGroup } from '../../types/page-match';
import { FakePageMatchGroupRepository } from '../../repository/__tests__/fakes/FakePageMatchGroupRepository';
import { PageMatchGroupService } from '../PageMatchGroupService';

describe('PageMatchGroupService.findOrCreateForAlias', () => {
  it('returns a fresh, empty group without persisting it when none exists yet for the alias', async () => {
    const repository = new FakePageMatchGroupRepository();
    const service = new PageMatchGroupService(repository);

    const group = await service.findOrCreateForAlias('alias-1');

    expect(group.aliasId).toBe('alias-1');
    expect(group.pageMatches.size).toBe(0);
    expect(repository.groups).toEqual([]); // not persisted until the caller adds a field and calls save()
  });

  it('returns the existing group bound to the alias instead of creating a second one', async () => {
    const existing: PageMatchGroup = {
      id: 'g1',
      aliasId: 'alias-1',
      pageMatches: new Map([['title', { name: 'title', selector: { type: PageSelectorType.CSS, value: 'h1' } }]]),
    };
    const repository = new FakePageMatchGroupRepository([existing]);
    const service = new PageMatchGroupService(repository);

    const group = await service.findOrCreateForAlias('alias-1');

    expect(group).toBe(existing);
  });
});

describe('PageMatchGroupService.save', () => {
  it('delegates to the repository', async () => {
    const repository = new FakePageMatchGroupRepository();
    const service = new PageMatchGroupService(repository);
    const group: PageMatchGroup = { id: 'g1', aliasId: 'alias-1', pageMatches: new Map() };

    await service.save(group);

    expect(repository.groups).toEqual([group]);
  });
});
