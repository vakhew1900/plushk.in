import { db } from '../db/index';
import type { DomainAlias } from '../types/domain-alias';
import { DexieRepository } from './DexieRepository';
import type { IDomainAliasRepository } from './interfaces/IDomainAliasRepository';

export class DomainAliasRepository extends DexieRepository<DomainAlias, string> implements IDomainAliasRepository {
  constructor() {
    super(db.domainAliases);
  }
}
