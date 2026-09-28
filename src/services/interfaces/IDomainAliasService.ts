import type { DomainAlias } from '../../types/domain-alias';

export interface IDomainAliasService {
  /** Returns the alias whose `domain_names` already includes `domain`, or creates (and persists) a new one bound to just that domain. */
  findOrCreateForDomain(domain: string): Promise<DomainAlias>;
}
