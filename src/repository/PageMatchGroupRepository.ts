import { db } from '../db/index';
import type { StoredPageMatchGroup } from '../db/index';
import type { PageMatch, PageMatchGroup } from '../types/page-match';
import { DexieRepository } from './DexieRepository';
import type { IPageMatchGroupRepository } from './interfaces/IPageMatchGroupRepository';

export class PageMatchGroupRepository
  extends DexieRepository<PageMatchGroup, string, StoredPageMatchGroup>
  implements IPageMatchGroupRepository
{
  constructor() {
    super(db.pageMatchGroups);
  }

  protected override toStored(group: PageMatchGroup): StoredPageMatchGroup {
    return {
      ...group,
      pageMatches: Object.fromEntries(group.pageMatches),
    };
  }

  protected override fromStored(stored: StoredPageMatchGroup): PageMatchGroup {
    return {
      ...stored,
      pageMatches: new Map<string, PageMatch>(Object.entries(stored.pageMatches)),
    };
  }
}
