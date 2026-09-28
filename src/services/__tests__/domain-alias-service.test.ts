import { describe, expect, it } from 'vitest';
import type { DomainAlias } from '../../types/domain-alias';
import { FakeDomainAliasRepository } from '../../repository/__tests__/fakes/FakeDomainAliasRepository';
import { DomainAliasService } from '../DomainAliasService';

describe('DomainAliasService.findOrCreateForDomain', () => {
  it('creates and persists a new alias bound to just that domain when none exists yet', async () => {
    const repository = new FakeDomainAliasRepository();
    const service = new DomainAliasService(repository);

    const alias = await service.findOrCreateForDomain('example.ru');

    expect(alias).toEqual({ id: expect.any(String), name: 'example.ru', domain_names: ['example.ru'] });
    expect(repository.aliases).toEqual([alias]);
  });

  it('returns the existing alias whose domain_names already includes the domain, without creating a second one', async () => {
    const existing: DomainAlias = { id: 'alias-1', name: 'Example', domain_names: ['example.ru', 'example.com'] };
    const repository = new FakeDomainAliasRepository([existing]);
    const service = new DomainAliasService(repository);

    const alias = await service.findOrCreateForDomain('example.com');

    expect(alias).toBe(existing);
    expect(repository.aliases).toEqual([existing]);
  });
});
