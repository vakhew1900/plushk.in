import { db } from '../db/index';
import type { Tag } from '../types/tag';
import { DexieRepository } from './DexieRepository';
import type { ITagRepository } from './interfaces/ITagRepository';

export class TagRepository extends DexieRepository<Tag, string> implements ITagRepository {
  constructor() {
    super(db.tags);
  }
}
