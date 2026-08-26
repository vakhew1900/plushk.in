import { IconButton } from '@/components/ui/icon-button';
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
          <IconButton
            icon={IconEdit}
            iconSize="sm"
            onClick={onEdit}
            title={t('bookmarkSettings.editLocationTooltip')}
          />
          <button type="button" className={styles.deleteLink} onClick={onRequestDelete}>
            <IconTrash size="sm" />
            {t('bookmarkSettings.deleteButton')}
          </button>
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
