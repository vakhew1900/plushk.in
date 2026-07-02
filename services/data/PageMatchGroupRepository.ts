import { db } from '../db/index';
import type { PageMatchGroup, PageMatch } from '../types/page-match';
import type { IPageMatchGroupRepository } from './interfaces/IPageMatchGroupRepository';
import type { StoredPageMatchGroup } from '../db/index';

function toStored(group: PageMatchGroup): StoredPageMatchGroup {
  return {
    ...group,
    pageMatches: Object.fromEntries(group.pageMatches),
  };
}

function fromStored(stored: StoredPageMatchGroup): PageMatchGroup {
  return {
    ...stored,
    pageMatches: new Map<string, PageMatch>(Object.entries(stored.pageMatches)),
  };
}

export class PageMatchGroupRepository implements IPageMatchGroupRepository {
  async getAll(): Promise<PageMatchGroup[]> {
    const stored = await db.pageMatchGroups.toArray();
    return stored.map(fromStored);
  }

  async getById(id: string): Promise<PageMatchGroup | undefined> {
    const stored = await db.pageMatchGroups.get(id);
    return stored ? fromStored(stored) : undefined;
  }

  async save(group: PageMatchGroup): Promise<void> {
    await db.pageMatchGroups.put(toStored(group));
  }

  async remove(id: string): Promise<void> {
    await db.pageMatchGroups.delete(id);
  }
}
