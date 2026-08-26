import { useState } from 'react';
import { useBookmarkNotes } from '@/hooks/useBookmarkNotes';
import { NoteDetailView } from './NoteDetailView';
import { NotesGridView } from './NotesGridView';

interface Props {
  bookmarkId: string;
}

export function BookmarkNotesTab({ bookmarkId }: Props) {
  const { notes, addNote, updateNote, removeNote } = useBookmarkNotes(bookmarkId);
  const [openNoteId, setOpenNoteId] = useState<string | undefined>(undefined);

  const openNote = notes.find((note) => note.id === openNoteId);

  const handleAdd = async () => {
    const note = await addNote();
    setOpenNoteId(note.id);
  };

  const handleDelete = async (id: string) => {
    await removeNote(id);
    if (openNoteId === id) setOpenNoteId(undefined);
  };

  if (openNote) {
    return (
      <NoteDetailView
        note={openNote}
        totalCount={notes.length}
        onBack={() => setOpenNoteId(undefined)}
        onTitleChange={(title) => void updateNote(openNote, { title })}
        onTextChange={(text) => void updateNote(openNote, { text })}
        onDelete={() => void handleDelete(openNote.id)}
      />
    );
  }

  return (
    <NotesGridView
      notes={notes}
      onAdd={() => void handleAdd()}
      onOpen={setOpenNoteId}
      onDelete={(id) => void handleDelete(id)}
    />
  );
}
