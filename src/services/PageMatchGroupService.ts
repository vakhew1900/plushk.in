import type { PageMatchGroup } from '../types/page-match';
import type { IPageMatchGroupRepository } from '../repository/interfaces/IPageMatchGroupRepository';
import type { IPageMatchGroupService } from './interfaces/IPageMatchGroupService';

export class PageMatchGroupService implements IPageMatchGroupService {
  constructor(private readonly pageMatchGroupRepository: IPageMatchGroupRepository) {}

  async findOrCreateForAlias(aliasId: string): Promise<PageMatchGroup> {
    const groups = await this.pageMatchGroupRepository.getAll();
    const existing = groups.find((g) => g.aliasId === aliasId);
    if (existing) return existing;

    return { id: crypto.randomUUID(), aliasId, pageMatches: new Map() };
  }

  async save(group: PageMatchGroup): Promise<void> {
    await this.pageMatchGroupRepository.save(group);
  }
}
