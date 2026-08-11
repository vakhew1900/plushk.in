import { BookmarkFavicon } from './BookmarkFavicon';
import { BookmarkTagEditor } from './tags/BookmarkTagEditor';
import styles from './CompactBookmarkCard.module.css';

interface Props {
  id: string;
  title: string;
  url: string;
  onClick: () => void;
}

export function CompactBookmarkCard({ id, title, url, onClick }: Props) {
  const domain = new URL(url).hostname;

  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <BookmarkFavicon seed={domain} url={url} />
      <div className={styles.meta}>
        <div className={styles.title}>{title}</div>
        <div className={styles.url}>{url.replace(/^https?:\/\//, '')}</div>
      </div>
      <BookmarkTagEditor bookmarkId={id} />
    </div>
  );
}
