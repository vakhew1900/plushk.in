import { db } from '../db/index';
import type { DomainAlias } from '../types/domain-alias';
import { DexieRepository } from './DexieRepository';
import type { IDomainAliasRepository } from './interfaces/IDomainAliasRepository';

export class DomainAliasRepository extends DexieRepository<DomainAlias, string> implements IDomainAliasRepository {
  constructor() {
    super(db.domainAliases);
  }

  // No FK cascade in Dexie — remove the PageMatchGroup linked to this alias
  // (if any) in the same transaction as the alias's own removal (RULE-12),
  // plus any IconRule bound to it via bindingType: 'alias' (RULE-13).
  override async remove(id: string): Promise<void> {
    await db.transaction('rw', this.table, db.pageMatchGroups, db.iconRules, async () => {
      await db.pageMatchGroups.where('aliasId').equals(id).delete();
      await db.iconRules.where('aliasId').equals(id).delete();
      await this.table.delete(id);
    });
  }
}
