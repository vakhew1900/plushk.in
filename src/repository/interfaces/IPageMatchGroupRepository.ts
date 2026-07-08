import type { PageMatchGroup } from '../../../types/page-match';

export interface IPageMatchGroupRepository {
  getAll(): Promise<PageMatchGroup[]>;
  getById(id: string): Promise<PageMatchGroup | undefined>;
  save(group: PageMatchGroup): Promise<void>;
  remove(id: string): Promise<void>;
}
