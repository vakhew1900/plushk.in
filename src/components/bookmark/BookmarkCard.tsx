import { Badge } from '@/components/ui/badge';
import { IconLink } from '@/components/icons';
import { BookmarkFavicon } from './BookmarkFavicon';
import { BookmarkFolderPath } from './BookmarkFolderPath';
import { BookmarkTagList } from './tags/BookmarkTagList';
import { BookmarkEntityControl } from './entity/BookmarkEntityControl';
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
  const lastFolder = folderPath[folderPath.length - 1];

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.topRow}>
        <BookmarkFavicon seed={domain} url={url} />
        <div className={styles.meta}>
          <div className={styles.title}>{title}</div>
          <div className={styles.domain}>{domain}</div>
        </div>
        {lastFolder && <Badge variant="accent">{lastFolder}</Badge>}
      </div>

      <BookmarkEntityControl bookmarkId={id} />

      <BookmarkFolderPath segments={folderPath} />

      <div className={styles.urlRow}>
        <IconLink size="sm" className={styles.urlIcon} />
        <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
      </div>

      <BookmarkTagList bookmarkId={id} />
    </div>
  );
}
