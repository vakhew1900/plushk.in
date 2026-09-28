import type { DomainAlias } from '../types/domain-alias';
import type { IDomainAliasRepository } from '../repository/interfaces/IDomainAliasRepository';
import type { IDomainAliasService } from './interfaces/IDomainAliasService';

export class DomainAliasService implements IDomainAliasService {
  constructor(private readonly domainAliasRepository: IDomainAliasRepository) {}

  async findOrCreateForDomain(domain: string): Promise<DomainAlias> {
    const aliases = await this.domainAliasRepository.getAll();
    const existing = aliases.find((a) => a.domain_names.includes(domain));
    if (existing) return existing;

    const alias: DomainAlias = { id: crypto.randomUUID(), name: domain, domain_names: [domain] };
    await this.domainAliasRepository.save(alias);
    return alias;
  }
}
