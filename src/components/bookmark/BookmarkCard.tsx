import { Badge } from '@/components/ui/badge';
import { IconLink } from '@/components/icons';
import { BookmarkFavicon } from './BookmarkFavicon';
import { BookmarkFolderPath } from './BookmarkFolderPath';
import styles from './BookmarkCard.module.css';

interface Props {
  title: string;
  url: string;
  folderPath: string[];
  onClick: () => void;
}

export function BookmarkCard({ title, url, folderPath, onClick }: Props) {
  const domain = new URL(url).hostname;
  const lastFolder = folderPath[folderPath.length - 1];

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.topRow}>
        <BookmarkFavicon seed={domain} />
        <div className={styles.meta}>
          <div className={styles.title}>{title}</div>
          <div className={styles.domain}>{domain}</div>
        </div>
        {lastFolder && <Badge variant="accent">{lastFolder}</Badge>}
      </div>

      <BookmarkFolderPath segments={folderPath} />

      <div className={styles.urlRow}>
        <IconLink size={12} className={styles.urlIcon} />
        <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
      </div>
    </div>
  );
}
