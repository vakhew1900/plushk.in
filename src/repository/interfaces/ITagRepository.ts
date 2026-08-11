import type { Tag } from '../../types/tag';

export interface ITagRepository {
  getAll(): Promise<Tag[]>;
  getById(id: string): Promise<Tag | undefined>;
  save(tag: Tag): Promise<void>;
  remove(id: string): Promise<void>;
}
