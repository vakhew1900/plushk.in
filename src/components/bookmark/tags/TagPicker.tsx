import type React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconCheck, IconTag } from '@/components/icons';
import { useTranslation } from '@/hooks/useTranslation';
import type { Tag } from '@/types/tag';
import { BookmarkTagChip } from './BookmarkTagChip';
import styles from './TagPicker.module.css';

interface Props {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
}

export function TagPicker({ tags, selectedTagIds, onToggle }: Props) {
  const { translate: t } = useTranslation();
  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  const handleClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={styles.wrap} onClick={handleClick}>
      {selectedTags.map((tag) => (
        <BookmarkTagChip key={tag.id} tag={tag} />
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            <IconTag size="sm" />
            {t('bookmarkTagEditor.editButton')}
          </Button>
        </PopoverTrigger>
        <PopoverContent onClick={handleClick}>
          {tags.length === 0 && <div className={styles.empty}>—</div>}
          {tags.map((tag) => {
            const checked = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                className={styles.item}
                onClick={() => onToggle(tag.id)}
              >
                <span className={styles.checkMark}>{checked && <IconCheck size="sm" />}</span>
                {tag.name}
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
