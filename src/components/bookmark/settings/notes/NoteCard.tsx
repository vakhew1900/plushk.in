import { IconEdit, IconTrash } from '@/components/icons';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { formatNoteDate } from '@/lib/note-date-format';
import type { Note } from '@/types/note';
import styles from './NoteCard.module.css';

interface Props {
  note: Note;
  onOpen: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onOpen, onDelete }: Props) {
  const { translate: t, locale } = useTranslation();
  const title = note.title.trim() || t('bookmarkSettings.noteTitlePlaceholder');

  return (
    <div className={styles.card}>
      <div className={styles.title} onClick={onOpen} role="button" tabIndex={0}>
        {title}
      </div>
      {note.text && (
        <Text as="div" size="body" tone="muted" className={styles.snippet}>
          {note.text}
        </Text>
      )}
      <div className={styles.footer}>
        <span className={styles.date}>{formatNoteDate(note.updatedAt, locale)}</span>
        <div className={styles.actions}>
          <IconButton icon={IconEdit} onClick={onOpen} title={t('bookmarkSettings.editIcon')} />
          <IconButton icon={IconTrash} variant="danger" onClick={onDelete} title={t('bookmarkSettings.deleteButton')} />
        </div>
      </div>
    </div>
  );
}
