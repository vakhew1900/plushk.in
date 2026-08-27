import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { BookmarkFolderPath } from '@/components/bookmark/BookmarkFolderPath';
import { IconLink, IconEdit, IconTrash } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkLocationView.module.css';

interface Props {
  folderPath: string[];
  url: string;
  onEdit: () => void;
  onRequestDelete: () => void;
}

/** Read-only state of `BookmarkLocationSection` — label + edit/delete actions, folder path, url. */
export function BookmarkLocationView({ folderPath, url, onEdit, onRequestDelete }: Props) {
  const { translate: t } = useTranslation();

  return (
    <>
      <div className={styles.headerRow}>
        <Text as="div" size="caption" weight="bold" tone="muted" className={styles.fieldLabel}>
          {t('bookmarkSettings.locationLabel')}
        </Text>
        <div className={styles.headerActions}>
          <Button variant="outline" size="sm" onClick={onEdit} className={styles.actionButton}>
            <IconEdit size="md" />
            {t('bookmarkSettings.editLocationButton')}
          </Button>
          <Button variant="outline" size="sm" onClick={onRequestDelete} className={styles.actionButton}>
            <span className={styles.deleteContent}>
              <IconTrash size="md" />
              {t('bookmarkSettings.deleteButton')}
            </span>
          </Button>
        </div>
      </div>
      <BookmarkFolderPath segments={folderPath} />
      <div className={styles.urlRow}>
        <IconLink size="sm" className={styles.urlIcon} />
        <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
      </div>
    </>
  );
}
