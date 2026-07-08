import type { DomainAlias } from '../../types/domain-alias';

export interface IDomainAliasRepository {
  getAll(): Promise<DomainAlias[]>;
  getById(id: string): Promise<DomainAlias | undefined>;
  save(alias: DomainAlias): Promise<void>;
  remove(id: string): Promise<void>;
}
