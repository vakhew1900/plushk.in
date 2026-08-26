import { useServices } from '@/hooks/useServices';
import { useCrudResource } from '@/hooks/useCrudResource';
import type { Note } from '@/types/note';

/** CRUD for the notes attached to one bookmark — see `NOTE-1`. */
export function useBookmarkNotes(bookmarkId: string) {
  const { noteRepository } = useServices();
  const { items: allNotes, save, remove } = useCrudResource(noteRepository, (note: Note) => note.id, []);

  const notes = allNotes
    .filter((note) => note.bookmarkId === bookmarkId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const addNote = async (): Promise<Note> => {
    const now = new Date().toISOString();
    const note: Note = { id: crypto.randomUUID(), bookmarkId, title: '', text: '', createdAt: now, updatedAt: now };
    await save(note);
    return note;
  };

  const updateNote = async (note: Note, changes: Partial<Pick<Note, 'title' | 'text'>>) => {
    await save({ ...note, ...changes, updatedAt: new Date().toISOString() });
  };

  const removeNote = async (id: string) => {
    await remove(id);
  };

  return { notes, addNote, updateNote, removeNote };
}
