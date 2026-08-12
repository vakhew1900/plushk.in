import type React from 'react';
import { PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { IconCheck } from '@/components/icons';
import { useBookmarkTagEditor } from '@/hooks/useBookmarkTagEditor';
import { BookmarkTagChip } from './BookmarkTagChip';
import styles from './BookmarkTagList.module.css';

interface Props {
  bookmarkId: string;
}

export function BookmarkTagList({ bookmarkId }: Props) {
  const { tags, selectedTags, tagIds, toggleTag } = useBookmarkTagEditor(bookmarkId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.wrap} onClick={handleClick}>
      {selectedTags.map((tag) => (
        <BookmarkTagChip key={tag.id} tag={tag} />
      ))}

      <PopoverAnchor asChild>
        <span className={styles.anchor} />
      </PopoverAnchor>

      <PopoverContent onClick={handleClick}>
        {tags.length === 0 && <div className={styles.empty}>—</div>}
        {tags.map((tag) => {
          const checked = tagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              role="checkbox"
              aria-checked={checked}
              className={styles.item}
              onClick={() => void toggleTag(tag.id)}
            >
              <span className={styles.checkMark}>{checked && <IconCheck size="sm" />}</span>
              {tag.name}
            </button>
          );
        })}
      </PopoverContent>
    </div>
  );
}
