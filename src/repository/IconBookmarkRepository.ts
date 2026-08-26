import { db } from '../db/index';
import type { IconBookmark } from '../types/icon-bookmark';
import { DexieRepository } from './DexieRepository';
import type { IIconBookmarkRepository } from './interfaces/IIconBookmarkRepository';

export class IconBookmarkRepository extends DexieRepository<IconBookmark, string> implements IIconBookmarkRepository {
  constructor() {
    super(db.iconBookmarks);
  }
}
