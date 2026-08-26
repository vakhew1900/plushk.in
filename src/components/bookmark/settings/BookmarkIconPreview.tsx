import { BookmarkFavicon, BookmarkFaviconSize } from '@/components/bookmark/BookmarkFavicon';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkIconPreview.module.css';

interface Props {
  seed: string;
  url: string;
  bookmarkId: string;
  onEditClick: () => void;
}

export function BookmarkIconPreview({ seed, url, bookmarkId, onEditClick }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <BookmarkFavicon seed={seed} url={url} bookmarkId={bookmarkId} size={BookmarkFaviconSize.XL} />
      <button type="button" className={styles.editLink} onClick={onEditClick}>
        {t('bookmarkSettings.editIcon')}
      </button>
    </div>
  );
}
