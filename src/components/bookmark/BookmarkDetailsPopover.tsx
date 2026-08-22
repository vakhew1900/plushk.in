import type React from 'react';
import { IconInfo, IconLink } from '@/components/icons';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { IconButton } from '@/components/ui/icon-button';
import { useTranslation } from '@/hooks/useTranslation';
import { BookmarkFolderPath } from './BookmarkFolderPath';
import styles from './BookmarkDetailsPopover.module.css';

interface Props {
  folderPath: string[];
  url: string;
}

/** Info-icon button revealing the folder path + full URL on demand, see `SEARCH-9` (kept out of the card's main layout by default). */
export function BookmarkDetailsPopover({ folderPath, url }: Props) {
  const { translate: t } = useTranslation();
  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          icon={IconInfo}
          className={styles.trigger}
          title={t('bookmarkCard.detailsTooltip')}
          onClick={handleClick}
        />
      </PopoverTrigger>
      <PopoverContent onClick={handleClick}>
        <div className={styles.wrap}>
          <BookmarkFolderPath segments={folderPath} />
          <div className={styles.urlRow}>
            <IconLink size="sm" className={styles.urlIcon} />
            <span className={styles.url}>{url.replace(/^https?:\/\//, '')}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
