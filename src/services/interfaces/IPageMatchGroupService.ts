import type { PageMatchGroup } from '../../types/page-match';

export interface IPageMatchGroupService {
  /** Returns the group bound to `aliasId`, or an in-memory (not yet persisted) one — mirrors the aliasId unique index, see RULE-12. */
  findOrCreateForAlias(aliasId: string): Promise<PageMatchGroup>;
  save(group: PageMatchGroup): Promise<void>;
}
