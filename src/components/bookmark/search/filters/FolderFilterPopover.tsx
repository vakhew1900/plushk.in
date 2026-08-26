import { useState } from 'react';
import { clsx } from 'clsx';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { RemoveIconButton } from '@/components/ui/remove-icon-button';
import { IconFolder } from '@/components/icons';
import { FolderTreeSearch } from '@/components/bookmark/folder-tree/FolderTreeSearch';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './FolderFilterPopover.module.css';

interface Props {
  folderPath: string | undefined;
  onChange: (folderPath: string | undefined) => void;
}

export function FolderFilterPopover({ folderPath, onChange }: Props) {
  const { translate: t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelect = (path: string | undefined) => {
    onChange(path);
    setOpen(false);
  };

  return (
    <div className={styles.group}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={clsx(styles.trigger, folderPath && styles.active)}>
            <IconFolder size="sm" />
            <span className={styles.label}>{folderPath ?? t('searchTab.filters.folderLabel')}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className={styles.content}>
          <FolderTreeSearch selectedPath={folderPath ?? ''} onSelect={handleSelect} />
        </PopoverContent>
      </Popover>

      {folderPath && (
        <RemoveIconButton
          iconSize="sm"
          onClick={() => onChange(undefined)}
          aria-label={t('searchTab.filters.folderClear')}
        />
      )}
    </div>
  );
}
