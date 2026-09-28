import type { PageMatchGroup } from '../../../types/page-match';
import type { IPageMatchGroupRepository } from '../../interfaces/IPageMatchGroupRepository';

/** Shared in-memory fake — used by more than one `services/__tests__/*` spec. */
export class FakePageMatchGroupRepository implements IPageMatchGroupRepository {
  constructor(public groups: PageMatchGroup[] = []) {}

  async getAll(): Promise<PageMatchGroup[]> {
    return this.groups;
  }

  async getById(id: string): Promise<PageMatchGroup | undefined> {
    return this.groups.find((g) => g.id === id);
  }

  async save(group: PageMatchGroup): Promise<void> {
    this.groups = [...this.groups.filter((g) => g.id !== group.id), group];
  }

  async remove(id: string): Promise<void> {
    this.groups = this.groups.filter((g) => g.id !== id);
  }
}
