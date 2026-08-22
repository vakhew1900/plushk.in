import { useBookmarkEntityEditor } from '@/hooks/useBookmarkEntityEditor';
import { BookmarkDetailsPopover } from './BookmarkDetailsPopover';
import { BookmarkFavicon, BookmarkFaviconSize } from './BookmarkFavicon';
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
      <BookmarkFavicon seed={domain} url={url} size={BookmarkFaviconSize.WIDE} />

      <div className={styles.content}>
        <div className={styles.headRow}>
          <div className={styles.meta}>
            <div className={styles.title} title={title}>{title}</div>
            <div className={styles.domain}>{domain}</div>
          </div>
          {entityTypes.length > 0 && (
            <EntitySegment
              entityTypes={entityTypes}
              selectedEntity={selectedEntity}
              onChoose={(entityTypeId) => void chooseEntity(entityTypeId)}
              colored
            />
          )}
        </div>

        <div className={styles.footRow}>
          <BookmarkTagList bookmarkId={id} />
          {showStatus && (
            <StatusSegment
              statuses={statuses}
              selectedStatus={selectedStatus}
              onChoose={(statusId) => void chooseStatus(statusId)}
            />
          )}
          <BookmarkDetailsPopover folderPath={folderPath} url={url} />
        </div>
      </div>
    </div>
  );
}
