import type { DomainAlias } from '../../../types/domain-alias';
import type { IDomainAliasRepository } from '../../interfaces/IDomainAliasRepository';

/** Shared in-memory fake — used by more than one `services/__tests__/*` spec. */
export class FakeDomainAliasRepository implements IDomainAliasRepository {
  constructor(public aliases: DomainAlias[] = []) {}

  async getAll(): Promise<DomainAlias[]> {
    return this.aliases;
  }

  async getById(id: string): Promise<DomainAlias | undefined> {
    return this.aliases.find((a) => a.id === id);
  }

  async save(alias: DomainAlias): Promise<void> {
    this.aliases = [...this.aliases.filter((a) => a.id !== alias.id), alias];
  }

  async remove(id: string): Promise<void> {
    this.aliases = this.aliases.filter((a) => a.id !== id);
  }
}
