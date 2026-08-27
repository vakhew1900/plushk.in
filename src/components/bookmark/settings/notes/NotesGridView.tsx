import { IconPlus } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import type { Note } from '@/types/note';
import { NoteCard } from './NoteCard';
import styles from './NotesGridView.module.css';

interface Props {
  notes: Note[];
  onAdd: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotesGridView({ notes, onAdd, onOpen, onDelete }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Text size="caption" tone="muted">
          {t('bookmarkSettings.notesCount', { count: notes.length })}
        </Text>
        <Button variant="accent-soft" size="sm" onClick={onAdd}>
          <IconPlus size="sm" />
          {t('bookmarkSettings.addNote')}
        </Button>
      </div>

      {notes.length === 0 ? (
        <Text size="body" tone="muted" className={styles.empty}>
          {t('bookmarkSettings.notesEmpty')}
        </Text>
      ) : (
        <div className={styles.grid}>
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onOpen={() => onOpen(note.id)} onDelete={() => onDelete(note.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
