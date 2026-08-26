import type { Note } from '../../types/note';
import type { ICrudRepository } from './ICrudRepository';

export interface INoteRepository extends ICrudRepository<Note> {
  /** Bulk-deletes every note for one bookmark — used by cascade cleanup (`BookmarkService`). */
  removeByBookmarkId(bookmarkId: string): Promise<void>;
}
