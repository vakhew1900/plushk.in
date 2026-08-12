import type React from 'react';
import { PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './BookmarkTagEditTrigger.module.css';

export function BookmarkTagEditTrigger() {
  const { translate: t } = useTranslation();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <PopoverTrigger asChild>
      <button type="button" className={styles.trigger} onClick={handleClick}>
        {t('bookmarkTagEditor.editButton')}
      </button>
    </PopoverTrigger>
  );
}
