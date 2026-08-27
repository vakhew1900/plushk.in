import { db } from '../db/index';
import type { Note } from '../types/note';
import { DexieRepository } from './DexieRepository';
import type { INoteRepository } from './interfaces/INoteRepository';

export class NoteRepository extends DexieRepository<Note, string> implements INoteRepository {
  constructor() {
    super(db.notes);
  }

  async removeByBookmarkId(bookmarkId: string): Promise<void> {
    await db.notes.where('bookmarkId').equals(bookmarkId).delete();
  }
}
