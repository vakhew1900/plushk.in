import { BookmarkFavicon, BookmarkFaviconSize } from '@/components/bookmark/BookmarkFavicon';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkIconPreview.module.css';

interface Props {
  seed: string;
  iconUrl: string | undefined;
  onEditClick: () => void;
}

export function BookmarkIconPreview({ seed, iconUrl, onEditClick }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <BookmarkFavicon seed={seed} iconUrl={iconUrl} size={BookmarkFaviconSize.XL} />
      <button type="button" className={styles.editLink} onClick={onEditClick}>
        {t('bookmarkSettings.editIcon')}
      </button>
    </div>
  );
}
