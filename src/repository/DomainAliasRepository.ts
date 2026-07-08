import { db } from '../db/index';
import type { DomainAlias } from '../types/domain-alias';
import type { IDomainAliasRepository } from './interfaces/IDomainAliasRepository';

export class DomainAliasRepository implements IDomainAliasRepository {
  async getAll(): Promise<DomainAlias[]> {
    return db.domainAliases.toArray();
  }

  async getById(id: string): Promise<DomainAlias | undefined> {
    return db.domainAliases.get(id);
  }

  async save(alias: DomainAlias): Promise<void> {
    await db.domainAliases.put(alias);
  }

  async remove(id: string): Promise<void> {
    await db.domainAliases.delete(id);
  }
}
