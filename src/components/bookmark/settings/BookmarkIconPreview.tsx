import { BookmarkArtwork, BookmarkArtworkSize } from '@/components/bookmark/BookmarkArtwork';
import { useTranslation } from '@/hooks/useTranslation';
import type { IconResultType } from '@/services/interfaces/IIconLinkService';
import styles from './BookmarkIconPreview.module.css';

interface Props {
  seed: string;
  iconUrl: string | undefined;
  iconType: IconResultType | undefined;
  onEditClick: () => void;
}

export function BookmarkIconPreview({ seed, iconUrl, iconType, onEditClick }: Props) {
  const { translate: t } = useTranslation();

  return (
    <div className={styles.wrap}>
      <BookmarkArtwork seed={seed} iconUrl={iconUrl} iconType={iconType} size={BookmarkArtworkSize.XL} />
      <button type="button" className={styles.editLink} onClick={onEditClick}>
        {t('bookmarkSettings.editIcon')}
      </button>
    </div>
  );
}
