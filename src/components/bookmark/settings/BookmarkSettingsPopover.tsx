import type React from 'react';
import { IconSettings } from '@/components/icons';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useTranslation } from '@/hooks/useTranslation';
import { BookmarkSettingsPanel } from './BookmarkSettingsPanel';
import styles from './BookmarkSettingsPopover.module.css';

interface Props {
  bookmarkId: string;
  url: string;
  seed: string;
}

/** Gear-icon rail on `BookmarkCard` opening the bookmark settings popover — see UI-15. */
export function BookmarkSettingsPopover({ bookmarkId, url, seed }: Props) {
  const { translate: t } = useTranslation();
  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.rail}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={styles.trigger}
            title={t('bookmarkSettings.triggerTooltip')}
            onClick={handleClick}
          >
            <IconSettings size="sm" />
          </button>
        </PopoverTrigger>
        <PopoverContent onClick={handleClick} className={styles.content}>
          <BookmarkSettingsPanel bookmarkId={bookmarkId} url={url} seed={seed} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
