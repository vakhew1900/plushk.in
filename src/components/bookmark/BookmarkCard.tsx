import { IconLink } from '@/components/icons';
import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { BookmarkFavicon } from './BookmarkFavicon';
import { BookmarkFolderPath } from './BookmarkFolderPath';
import { BookmarkTagList } from './tags/BookmarkTagList';
import { EntitySegment } from './entity/EntitySegment';
import { StatusSegment } from './entity/StatusSegment';
import styles from './BookmarkCard.module.css';

interface Props {
  id: string;
  title: string;
  url: string;
  folderPath: string[];
  onClick: () => void;
}

export function BookmarkCard({ id, title, url, folderPath, onClick }: Props) {
  const domain = new URL(url).hostname;
  const { entityTypes, selectedEntity, statuses, selectedStatus, chooseEntity, chooseStatus } =
    useBookmarkEntityEditor(id);
  const showStatus = Boolean(selectedEntity) && statuses.length > 0;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.topRow}>
        <BookmarkFavicon seed={domain} url={url} />
        <div className={styles.meta}>
          <div className={styles.title}>{title}</div>
          <div className={styles.domain}>{domain}</div>
        </div>
        {entityTypes.length > 0 && (
          <EntitySegment
            entityTypes={entityTypes}
            selectedEntity={selectedEntity}
            onChoose={(entityTypeId) => void chooseEntity(entityTypeId)}
          />
        )}
      </div>

      <BookmarkFolderPath segments={folderPath} />

      <div className={styles.urlRow}>
        <IconLink size="sm" className={styles.urlIcon} />
        <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
      </div>

      <div className={styles.bottomRow}>
        <BookmarkTagList bookmarkId={id} />
        {showStatus && (
          <StatusSegment
            statuses={statuses}
            selectedStatus={selectedStatus}
            onChoose={(statusId) => void chooseStatus(statusId)}
          />
        )}
      </div>
    </div>
  );
}
