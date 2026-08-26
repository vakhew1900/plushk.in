import { useEffect, useRef } from 'react';
import { IconArrowLeft, IconTrash } from '@/components/icons';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';
import { useTranslation } from '@/hooks/useTranslation';
import { formatNoteTimestamp } from '@/lib/note-date-format';
import type { Note } from '@/types/note';
import styles from './NoteDetailView.module.css';

interface Props {
  note: Note;
  totalCount: number;
  onBack: () => void;
  onTitleChange: (title: string) => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
}

export function NoteDetailView({ note, totalCount, onBack, onTitleChange, onTextChange, onDelete }: Props) {
  const { translate: t, locale } = useTranslation();
  const titleRef = useRef<HTMLInputElement>(null);
  const isNewNote = !note.title && !note.text;

  useEffect(() => {
    // Only steal focus for a brand-new empty note — never when reopening one that already has content.
    if (isNewNote) titleRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the open note itself changes, not on every keystroke
  }, [note.id]);

  return (
    <div className={styles.wrap}>
      <div className={styles.topRow}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          <IconArrowLeft size="sm" />
          {t('bookmarkSettings.allNotes', { count: totalCount })}
        </button>
        <IconButton icon={IconTrash} variant="danger" onClick={onDelete} title={t('bookmarkSettings.deleteButton')} />
      </div>

      <Input
        ref={titleRef}
        className={styles.titleInput}
        value={note.title}
        placeholder={t('bookmarkSettings.noteTitlePlaceholder')}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <Text size="caption" tone="muted" className={styles.timestamp}>
        {t('bookmarkSettings.noteUpdatedAt', { date: formatNoteTimestamp(note.updatedAt, locale) })}
      </Text>

      <Textarea
        className={styles.textArea}
        value={note.text}
        placeholder={t('bookmarkSettings.noteTextPlaceholder')}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
}
