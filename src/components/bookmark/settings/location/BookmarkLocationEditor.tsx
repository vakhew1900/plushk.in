import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { FolderTree } from '@/components/bookmark/folder-tree/FolderTree';
import { IconFolder, IconCheck } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkLocationEditor.module.css';

interface Props {
  draftPath: string;
  onDraftPathChange: (path: string) => void;
  onCancel: () => void;
  onMove: () => void;
}

/** Editing state of `BookmarkLocationSection` — label (no actions beside it), path input + `FolderTree` + move/cancel. */
export function BookmarkLocationEditor({ draftPath, onDraftPathChange, onCancel, onMove }: Props) {
  const { translate: t } = useTranslation();

  return (
    <>
      <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
        {t('bookmarkSettings.locationLabel')}
      </Text>
      <div className={styles.editBox}>
        <div className={styles.pathRow}>
          <IconFolder size="md" className={styles.pathIcon} />
          <Input value={draftPath} onChange={(e) => onDraftPathChange(e.target.value)} />
        </div>
        <FolderTree selectedPath={draftPath} onSelect={onDraftPathChange} />
        <div className={styles.editActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t('bookmarkSettings.moveCancelButton')}
          </Button>
          <Button size="sm" onClick={onMove}>
            <IconCheck size="sm" />
            {t('bookmarkSettings.moveButton')}
          </Button>
        </div>
      </div>
    </>
  );
}
